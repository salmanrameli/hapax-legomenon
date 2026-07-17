package main

import (
	"bytes"
	"context"
	"embed"
	"encoding/base64"
	"encoding/csv"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	goRuntime "runtime"
	"strings"
	"time"
	"ubiquitous-funicular/constants"
	"ubiquitous-funicular/structs"

	"github.com/google/uuid"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

//go:embed python/*
var pythonFolder embed.FS

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

func (a *App) getProjectConfigPaths() (*structs.ProjectConfigPathStructure, error) {
	userConfigDir, err := os.UserConfigDir()

	if err != nil {
		log.Fatalf("unable to locate user config directory: %s\n", err)

		return &structs.ProjectConfigPathStructure{}, err
	}

	projectsPath := userConfigDir + constants.APP_USER_CONFIG_DIR
	configUserProjects := "/" + constants.APP_SETTING_USER_PROJECTS

	return &structs.ProjectConfigPathStructure{
		ProjectPath:        projectsPath,
		ArchivedTokensDir:  projectsPath + constants.APP_CREATED_TOKENS_DIR,
		UserProjectsDir:    projectsPath + constants.APP_USER_PROJECTS_DIR,
		ConfigUserProjects: projectsPath + configUserProjects,
	}, nil
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) CheckAppConfig() {
	projectDetail, err := a.getProjectConfigPaths()

	if err != nil {
		log.Fatalf("CheckAppConfig getProjectConfigPaths error: %s\n", err)

		return
	}

	a.checkAppProjectDir(projectDetail.ProjectPath, projectDetail.UserProjectsDir)

	a.checkUserProjectsDirContent(projectDetail.UserProjectsDir)

	a.ConfigureUserProjectsFile(projectDetail.ConfigUserProjects)
}

func (a *App) checkUserProjectsDirContent(path string) {
	_, err := os.Stat(path)

	if os.IsNotExist(err) {
		if err := os.Mkdir(path, os.ModePerm); err != nil {
			log.Fatalf("app checkUserProjectsDirContent error in creating application project directory: %s\n", err)
		}
	}
}

func (a *App) GetCurrentProjectDetail() *structs.UserProjectItem {
	projectDetail, err := a.getProjectConfigPaths()

	if err != nil {
		log.Fatalf("GetTrainingConfigValue getProjectConfigPaths error getting directory: %v\n", err)

		return &structs.UserProjectItem{}
	}

	content, err := os.ReadFile(projectDetail.ConfigUserProjects)

	if err != nil {
		log.Fatalf("GetTrainingConfigValue error opening file: %v\n", err)

		return &structs.UserProjectItem{}
	}

	var config structs.UserProjects

	err = json.Unmarshal(content, &config)

	if err != nil {
		log.Fatalf("GetTrainingConfigValue error parsing JSON: %v\n", err)

		return &structs.UserProjectItem{}
	}

	selected := config.Selected

	result := &structs.UserProjectItem{}

	for _, item := range config.Options {
		if item.ID == selected {
			result.ID = item.ID
			result.Name = item.Name
			break
		}
	}

	return result
}

func (a *App) HandleCreateNewProject(name string, useProject bool) error {
	projectDetail, err := a.getProjectConfigPaths()

	if err != nil {
		log.Fatalf("HandleCreateNewProject getProjectConfigPaths error getting directory: %v\n", err)

		return err
	}

	content, err := os.ReadFile(projectDetail.ConfigUserProjects)

	if err != nil {
		log.Fatalf("HandleCreateNewProject error opening file: %v\n", err)

		return err
	}

	var config structs.UserProjects

	err = json.Unmarshal(content, &config)

	if err != nil {
		log.Fatalf("HandleCreateNewProject error parsing JSON: %v\n", err)

		return err
	}

	id := uuid.New().String()

	id = id[:8]

	newProject := &structs.UserProjectItem{
		ID:   id,
		Name: name,
	}

	config.Options = append(config.Options, *newProject)

	file, err := os.OpenFile(projectDetail.ConfigUserProjects, os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0644)

	if err != nil {
		log.Fatalf("HandleCreateNewProject failed to open file: %v\n", err)

		return err
	}

	defer file.Close()

	encoder := json.NewEncoder(file)

	encoder.SetIndent("", "  ")

	updatedValue := &structs.UserProjects{
		Options: config.Options,
	}

	if useProject {
		updatedValue.Selected = id
	}

	err = encoder.Encode(updatedValue)

	if err != nil {
		log.Fatalf("HandleCreateNewProject failed to write JSON: %v\n", err)

		return err
	}

	projectDirectory := projectDetail.UserProjectsDir + "/" + id

	if err := os.Mkdir(projectDirectory, os.ModePerm); err != nil {
		log.Fatalf("app HandleCreateNewProject error in creating project directory: %s\n", err)
	}

	archivedTokenDirectory := projectDetail.UserProjectsDir + "/" + id + "/" + constants.APP_CREATED_TOKENS_DIR

	if err := os.Mkdir(archivedTokenDirectory, os.ModePerm); err != nil {
		log.Fatalf("app HandleCreateNewProject error in creating archived tokens directory: %s\n", err)
	}

	a.configureTokenDatabaseFile(projectDirectory + "/" + constants.TOKEN_DATABASE)

	a.configureTrainingConfig(projectDirectory + "/" + constants.APP_SETTING_TRAINING)

	a.configureGeneratePromptConfig(projectDirectory + "/" + constants.APP_SETTING_PROMPT)

	a.configureGenerateImageConfig(projectDirectory + "/" + constants.APP_SETTING_GENERATE_IMAGE)

	return nil
}

func (a *App) SetSelectedProject(projectId string) error {
	projectDetail, err := a.getProjectConfigPaths()

	if err != nil {
		log.Fatalf("SetSelectedProject getProjectConfigPaths error getting directory: %v\n", err)

		return err
	}

	content, err := os.ReadFile(projectDetail.ConfigUserProjects)

	if err != nil {
		log.Fatalf("SetSelectedProject error opening file: %v\n", err)

		return err
	}

	var config structs.UserProjects

	err = json.Unmarshal(content, &config)

	if err != nil {
		log.Fatalf("SetSelectedProject error parsing JSON: %v\n", err)

		return err
	}

	file, err := os.OpenFile(projectDetail.ConfigUserProjects, os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0644)

	if err != nil {
		log.Fatalf("SetSelectedProject failed to open file: %v\n", err)

		return err
	}

	defer file.Close()

	encoder := json.NewEncoder(file)

	encoder.SetIndent("", "  ")

	updatedValue := &structs.UserProjects{
		Selected: projectId,
		Options:  config.Options,
	}

	err = encoder.Encode(updatedValue)

	if err != nil {
		log.Fatalf("SetSelectedProject failed to write JSON: %v\n", err)

		return err
	}

	return nil
}

func (a *App) GetUserProjectsList() ([]structs.UserProjectItem, error) {
	projectDetail, err := a.getProjectConfigPaths()

	if err != nil {
		log.Fatalf("GetUserProjectsList getProjectConfigPaths error getting directory: %v\n", err)

		return []structs.UserProjectItem{}, err
	}

	content, err := os.ReadFile(projectDetail.ConfigUserProjects)

	if err != nil {
		log.Fatalf("GetUserProjectsList error opening file: %v\n", err)

		return []structs.UserProjectItem{}, err
	}

	var config structs.UserProjects

	err = json.Unmarshal(content, &config)

	if err != nil {
		log.Fatalf("GetUserProjectsList error parsing JSON: %v\n", err)

		return []structs.UserProjectItem{}, err
	}

	return config.Options, nil
}

func (a *App) CheckIfPythonIsInstalled() bool {
	_, err := exec.LookPath("python3")

	if err != nil {
		return false
	}

	return true
}

func (a *App) checkOllama(projectId string) bool {
	trainingConfig, err := a.GetTrainingConfigValue(projectId)

	if err != nil {
		log.Fatalf("checkOllama GetTrainingConfigValue error: %v\n", err)

		return false
	}

	client := http.Client{
		Timeout: 2 * time.Second,
	}

	resp, err := client.Get(trainingConfig.URLLocal)

	if err != nil {
		return false
	}

	defer resp.Body.Close()

	return resp.StatusCode == http.StatusOK
}

func (a *App) CheckIfOllamaIsRunning(projectId string) bool {
	if !a.checkOllama(projectId) {
		return false
	}

	return true
}

func (a *App) checkAppProjectDir(path string, userProjectsDir string) {
	_, err := os.Stat(path)

	if os.IsNotExist(err) {
		if err := os.Mkdir(path, os.ModePerm); err != nil {
			log.Fatalf("app checkAppProjectDir error in creating application project directory: %s\n", err)

			return
		}
	}
	_, err = os.Stat(userProjectsDir)

	if os.IsNotExist(err) {
		if err := os.Mkdir(userProjectsDir, os.ModePerm); err != nil {
			log.Fatalf("app checkAppProjectDir error in creating application user project directory: %s\n", err)

			return
		}
	}
}

func (a *App) ConfigureUserProjectsFile(path string) {
	_, err := os.Stat(path)

	if os.IsNotExist(err) {
		userProjects, err := os.Create(path)

		if err != nil {
			log.Fatalf("app createUserProjectsFile error in creating user projects config file: %s\n", err)

			return
		}

		defer userProjects.Close()

		defaultUserProjects := structs.UserProjects{
			Selected: "",
			Options:  []structs.UserProjectItem{},
		}

		encoder := json.NewEncoder(userProjects)
		encoder.SetIndent("", "    ")

		err = encoder.Encode(defaultUserProjects)

		if err != nil {
			log.Fatalf("app createUserProjectsFile unable to write default user project config: %s\n", err)

			return
		}
	}
}

func (a *App) GetAvailableLocalModels() (*structs.LocalModelResponseArray, error) {
	url := "http://localhost:11434/api/tags"

	req, err := http.NewRequest(http.MethodGet, url, nil)

	if err != nil {
		log.Fatalf("GetAvailableLocalModels error creating request: %v\n", err)
	}

	req.Header.Add("Accept", "application/json")
	req.Header.Add("User-Agent", "Go-HTTP-Client")

	client := &http.Client{}

	resp, err := client.Do(req)

	if err != nil {
		log.Fatalf("GetAvailableLocalModels error sending request: %v\n", err)

		return &structs.LocalModelResponseArray{}, err
	}

	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)

	if err != nil {
		log.Fatalf("GetAvailableLocalModels error reading response: %v\n", err)

		return &structs.LocalModelResponseArray{}, err
	}

	var result *structs.LocalModelResponseArray

	err = json.Unmarshal(body, &result)

	if err != nil {
		log.Fatalf("GetAvailableLocalModels Failed to unmarshal JSON: %v\n", err)
	}

	return &structs.LocalModelResponseArray{
		Models: result.Models,
	}, nil
}

func (a *App) configureTokenDatabaseFile(path string) {
	_, err := os.Stat(path)

	if os.IsNotExist(err) {
		file, err := os.Create(path)

		if err != nil {
			log.Fatalf("app configureTokenDatabaseFile error in creating projects token database file: %v\n", err)

			return
		}

		defer file.Close()

		writer := csv.NewWriter(file)

		defer writer.Flush()

		header := []string{"tier", "ok", "module", "sub_module", "token_concept", "surabaya_specific", "poids_structurel", "xeno_index"}

		if err := writer.Write(header); err != nil {
			log.Fatalf("app configureTokenDatabaseFile error in writing token database header: %v\n", err)

			return
		}
	}
}

func (a *App) configureTrainingConfig(path string) {
	_, err := os.Stat(path)

	if os.IsNotExist(err) {
		configTraining, err := os.Create(path)

		if err != nil {
			log.Fatalf("app configureTrainingConfig error in creating projects training config file: %v\n", err)

			return
		}

		defer configTraining.Close()

		defaultConfigTraining := structs.ConfigTraining{
			Mode:        constants.TrainImageMode.LocalValue(),
			Model:       "",
			URLLocal:    constants.LOCAL_DEFAULT_URL,
			URLCloud:    "",
			APIKeyCloud: "",
		}

		encoder := json.NewEncoder(configTraining)
		encoder.SetIndent("", "    ")

		err = encoder.Encode(defaultConfigTraining)

		if err != nil {
			log.Fatalf("app configureTrainingConfig unable to write default training config: %s\n", err)

			return
		}
	}
}

func (a *App) configureGeneratePromptConfig(path string) {
	_, err := os.Stat(path)

	if os.IsNotExist(err) {
		configPrompt, err := os.Create(path)

		if err != nil {
			log.Fatalf("app configureGeneratePromptConfig error in creating projects generate prompt config file: %s\n", err)

			return
		}

		defer configPrompt.Close()

		defaultPromptConfig := structs.ConfigGeneratePrompt{
			Mode:        constants.GeneratePromptMode.LocalValue(),
			Model:       "",
			URLLocal:    constants.LOCAL_DEFAULT_URL,
			URLCloud:    "",
			APIKeyCloud: "",
		}

		encoder := json.NewEncoder(configPrompt)
		encoder.SetIndent("", "    ")

		err = encoder.Encode(defaultPromptConfig)

		if err != nil {
			log.Fatalf("app configureGeneratePromptConfig unable to write default generate prompt config: %s\n", err)

			return
		}
	}
}

func (a *App) configureGenerateImageConfig(path string) {
	_, err := os.Stat(path)

	if os.IsNotExist(err) {
		configImage, err := os.Create(path)

		if err != nil {
			log.Fatalf("app configureGenerateImageConfig error in creating projects generate image config file: %s\n", err)

			return
		}

		defer configImage.Close()

		defaultImageConfig := structs.ConfigGenerateImage{
			Mode:            constants.GenerateImageMode.LocalValue(),
			Model:           "",
			URLLocal:        constants.LOCAL_DEFAULT_URL,
			URLCloud:        "",
			APIKeyCloud:     "",
			Steps:           constants.GENERATE_IMAGE_DEFAULT_STEPS,
			DimensionWidth:  constants.GENERATE_IMAGE_DEFAULT_DIMENSION,
			DimensionHeight: constants.GENERATE_IMAGE_DEFAULT_DIMENSION,
		}

		encoder := json.NewEncoder(configImage)
		encoder.SetIndent("", "    ")

		err = encoder.Encode(defaultImageConfig)

		if err != nil {
			log.Fatalf("app configureGenerateImageConfig unable to write default application generate image config: %s\n", err)

			return
		}
	}
}

func (a *App) GeneratePrompt(projectId string) (string, error) {
	promptConfig, err := a.GetGeneratePromptConfigValue(projectId)

	if err != nil {
		log.Fatalf("GeneratePrompt GetTrainingConfigValue error: %v\n", err)

		return "", err
	}

	var modelURL string

	if promptConfig.Mode == constants.TrainImageMode.LocalValue() {
		modelURL = promptConfig.URLLocal + constants.SUFFIX_LOCAL_MODEL_TEXT
	} else {
		modelURL = promptConfig.URLCloud
	}

	projectConfigPath, err := a.getProjectConfigPaths()

	if err != nil {
		log.Fatalf("GeneratePrompt getProjectConfigPaths error: %v\n", err)

		return "", err
	}

	tmpDir, err := os.MkdirTemp("", "wails_python_*")

	if err != nil {
		return "", err
	}

	defer os.RemoveAll(tmpDir)

	pythonInterpreter := "python3"
	scriptName := "generate_prompt.py"
	tokenDatabasePath := projectConfigPath.UserProjectsDir + "/" + projectId + "/" + constants.TOKEN_DATABASE

	scriptData, err := pythonFolder.ReadFile("python/" + scriptName)

	if err != nil {
		log.Fatalf("GeneratePrompt unable to read file: %v", err)

		return "", err
	}

	tmpScriptPath := filepath.Join(tmpDir, scriptName)

	if err := os.WriteFile(tmpScriptPath, scriptData, 0755); err != nil {
		log.Fatalf("GeneratePrompt error in writefile: %v", err)

		return "", err
	}

	cmd := exec.Command(
		pythonInterpreter,
		tmpScriptPath,
		modelURL,
		promptConfig.Model,
		projectConfigPath.ProjectPath,
		tokenDatabasePath,
	)

	output, err := cmd.CombinedOutput()

	if err != nil {
		log.Fatalf("GeneratePrompt failed to execute script: %v\nOutput: %s\n", err, string(output))

		return "", err
	}

	return string(output), nil
}

func (a *App) GenerateImage(projectId string, prompt string) (string, error) {
	imageConfig, err := a.GetGenerateImageConfigValue(projectId)

	if err != nil {
		log.Fatalf("GenerateImage GetGenerateImageConfigValue error: %v\n", err)

		return "", err
	}

	var modelURL string

	if imageConfig.Mode == constants.TrainImageMode.LocalValue() {
		modelURL = imageConfig.URLLocal + constants.SUFFIX_LOCAL_MODEL_IMAGE
	} else {
		modelURL = imageConfig.URLCloud
	}

	reqBody := &structs.ImageGenRequest{
		Model:  imageConfig.Model,
		Prompt: prompt,
		Stream: false,
		Options: map[string]interface{}{
			"width":  imageConfig.DimensionWidth,
			"height": imageConfig.DimensionHeight,
			"steps":  imageConfig.Steps,
		},
	}

	jsonData, err := json.Marshal(reqBody)

	if err != nil {
		log.Fatalf("GenerateImage error marshaling request: %v\n", err)

		return "", err
	}

	resp, err := http.Post(modelURL, "application/json", bytes.NewBuffer(jsonData))

	if err != nil {
		log.Fatalf("GenerateImage API call failed: %v\n", err)

		return "", err
	}

	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)

	if err != nil {
		fmt.Printf("GenerateImage error reading response body: %v\n", err)

		return "", err
	}

	var result *structs.ImageGenResponse

	if err := json.Unmarshal(body, &result); err != nil {
		log.Fatalf("GenerateImage error unmarshaling response JSON: %v\n", err)

		return "", err
	}

	if result.Image == "" {
		log.Fatalf("GenerateImage no image returned")

		return "", nil
	}

	return result.Image, nil
}

func (a *App) SaveImage(base64Str string, prompt string, projectName string) error {
	timestamp := time.Now().Format("20060102_150405")

	projectName = strings.ReplaceAll(projectName, " ", "_")
	defaultFolderName := fmt.Sprintf("%s_generate_image_%s", projectName, timestamp)
	defaultFilename := fmt.Sprintf("generate_image_%s", timestamp)
	defaultTxtName := fmt.Sprintf("prompt_image_%s", timestamp)

	selectedPath, err := runtime.SaveFileDialog(a.ctx, runtime.SaveDialogOptions{
		Title:           "Save Result",
		DefaultFilename: defaultFolderName,
		Filters: []runtime.FileFilter{
			{DisplayName: "Project Folder"},
		},
	})

	if err != nil {
		log.Fatalf("SaveImage failed to open dialog: %v", err)

		return err
	}

	if selectedPath == "" {
		return nil
	}

	err = os.MkdirAll(selectedPath, 0755)

	if err != nil {
		log.Fatalf("SaveImage failed to create directory: %v", err)

		return err
	}

	imageBytes, err := base64.StdEncoding.DecodeString(base64Str)

	if err != nil {
		log.Fatalf("SaveImage failed to decode image: %v", err)

		return err
	}

	imagePath := filepath.Join(selectedPath, defaultFilename+".png")
	textPath := filepath.Join(selectedPath, defaultTxtName+".txt")

	err = os.WriteFile(imagePath, imageBytes, 0644)

	if err != nil {
		log.Fatalf("SaveImage failed to save image: %v", err)
	}

	err = os.WriteFile(textPath, []byte(prompt), 0644)

	if err != nil {
		log.Fatalf("SaveImage failed to save text: %v", err)

		return err
	}

	return nil
}

func (a *App) DescriptionsToTokens(projectId string, texts string) (string, error) {
	trainingConfig, err := a.GetTrainingConfigValue(projectId)

	if err != nil {
		log.Fatalf("DescriptionsToTokens GetTrainingConfigValue error: %v\n", err)

		return "", err
	}

	var modelURL string

	if trainingConfig.Mode == constants.TrainImageMode.LocalValue() {
		modelURL = trainingConfig.URLLocal + constants.SUFFIX_LOCAL_MODEL_TEXT
	} else {
		modelURL = trainingConfig.URLCloud
	}

	projectConfigPath, err := a.getProjectConfigPaths()

	if err != nil {
		log.Fatalf("DescriptionsToTokens getProjectConfigPaths error: %v\n", err)

		return "", err
	}

	tmpDir, err := os.MkdirTemp("", "wails_python_*")

	if err != nil {
		log.Fatalf("DescriptionsToTokens unable to create temporary folder")

		return "", err
	}

	defer os.RemoveAll(tmpDir)

	pythonInterpreter := "python3"
	scriptName := "descriptions_to_tokens.py"
	tokenDatabasePath := projectConfigPath.UserProjectsDir + "/" + projectId + "/" + constants.TOKEN_DATABASE

	scriptData, err := pythonFolder.ReadFile("python/" + scriptName)

	if err != nil {
		log.Fatalf("DescriptionsToTokens unable to read file: %v", err)

		return "", err
	}

	tmpScriptPath := filepath.Join(tmpDir, scriptName)

	if err := os.WriteFile(tmpScriptPath, scriptData, 0755); err != nil {
		log.Fatalf("DescriptionsToTokens error in writefile: %v", err)

		return "", err
	}

	timestamp := time.Now().Format("20060102_150405")

	filename := fmt.Sprintf("tokens_%s", timestamp)

	cmd := exec.Command(
		pythonInterpreter,
		tmpScriptPath,
		projectId,
		modelURL,
		trainingConfig.Model,
		projectConfigPath.ProjectPath,
		tokenDatabasePath,
		texts,
		filename,
	)

	output, err := cmd.CombinedOutput()

	if err != nil {
		log.Fatalf("DescriptionsToTokens failed to execute script: %v\nOutput: %s\n", err, string(output))

		return "", err
	}

	return string(output), nil
}

func (a *App) StartImageTraining(projectId string, imagePath string) (string, error) {
	trainingConfig, err := a.GetTrainingConfigValue(projectId)

	if err != nil {
		log.Fatalf("StartImageTraining GetTrainingConfigValue error: %v\n", err)

		return "", err
	}

	var modelURL string

	if trainingConfig.Mode == constants.TrainImageMode.LocalValue() {
		modelURL = trainingConfig.URLLocal + constants.SUFFIX_LOCAL_MODEL_TEXT
	} else {
		modelURL = trainingConfig.URLCloud
	}

	tmpDir, err := os.MkdirTemp("", "wails_python_*")

	if err != nil {
		return "", err
	}

	defer os.RemoveAll(tmpDir)

	pythonInterpreter := "python3"
	scriptName := "image_to_description.py"

	result, err := a.EncodeImagesFromPath([]string{imagePath})

	if err != nil {
		log.Fatalf("StartImageTraining EncodeImagesFromPath error: %v\n", err)

		return "", err
	}

	scriptData, err := pythonFolder.ReadFile("python/" + scriptName)

	if err != nil {
		log.Fatalf("StartImageTraining unable to read file: %v", err)

		return "", err
	}

	tmpScriptPath := filepath.Join(tmpDir, scriptName)

	if err := os.WriteFile(tmpScriptPath, scriptData, 0755); err != nil {
		log.Fatalf("StartImageTraining error in writefile: %v", err)

		return "", err
	}

	cmd := exec.Command(
		pythonInterpreter,
		tmpScriptPath,
		trainingConfig.Mode, // this is the sys.argv[1] in python
		modelURL,
		trainingConfig.Model,
		trainingConfig.APIKeyCloud,
	)

	var stdinBuf bytes.Buffer
	stdinBuf.WriteString(result[0])
	cmd.Stdin = &stdinBuf

	output, err := cmd.CombinedOutput()

	if err != nil {
		log.Fatalf("StartImageTraining failed to execute script: %v\nOutput: %s\n", err, string(output))

		return "", err
	}

	// fmt.Println("Python Script Output:")
	// fmt.Println(string(output))

	return string(output), nil
}

func (a *App) SelectImages() ([]string, error) {
	path, err := runtime.OpenMultipleFilesDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Select Images",
		Filters: []runtime.FileFilter{
			{
				DisplayName: "*.jpg, *.jpeg, *.png",
				Pattern:     "*.jpg;*.jpeg;*.png",
			},
		},
	})

	if err != nil {
		log.Fatalf("SelectImages unable to read selected images: %v\n", err)

		return nil, err
	}

	if len(path) > constants.MAX_UPLOAD_IMAGES {
		runtime.MessageDialog(a.ctx, runtime.MessageDialogOptions{
			Type:    runtime.WarningDialog,
			Title:   "Too Many Files",
			Message: "You can only select a maximum of 5 files.",
		})

		return path[:5], nil
	}

	return path, nil
}

func (a *App) EncodeImagesFromPath(paths []string) ([]string, error) {
	imageData := make([]string, 0, len(paths))

	for _, path := range paths {
		data, err := os.ReadFile(path)

		if err != nil {
			log.Fatalf("EncodeImagesFromPath unable to read selected images from the given paths: %s\n", err)

			return nil, err
		}

		imageData = append(imageData, base64.StdEncoding.EncodeToString(data))
	}

	return imageData, nil
}

func (a *App) GetTrainingConfigValue(projectId string) (*structs.ConfigTraining, error) {
	projectDetail, err := a.getProjectConfigPaths()

	if err != nil {
		log.Fatalf("GetTrainingConfigValue getProjectConfigPaths error getting directory: %v\n", err)

		return &structs.ConfigTraining{}, err
	}

	content, err := os.ReadFile(projectDetail.UserProjectsDir + "/" + projectId + "/" + constants.APP_SETTING_TRAINING)

	if err != nil {
		log.Fatalf("GetTrainingConfigValue error opening file: %v\n", err)

		return &structs.ConfigTraining{}, err
	}

	var config structs.ConfigTraining

	err = json.Unmarshal(content, &config)

	if err != nil {
		log.Fatalf("GetTrainingConfigValue error parsing JSON: %v\n", err)

		return &structs.ConfigTraining{}, err
	}

	return &config, nil
}

func (a *App) GetGeneratePromptConfigValue(projectId string) (*structs.ConfigGeneratePrompt, error) {
	projectDetail, err := a.getProjectConfigPaths()

	if err != nil {
		log.Fatalf("GetGeneratePromptConfigValue getProjectConfigPaths error getting directory: %v\n", err)

		return &structs.ConfigGeneratePrompt{}, err
	}

	content, err := os.ReadFile(projectDetail.UserProjectsDir + "/" + projectId + "/" + constants.APP_SETTING_PROMPT)

	if err != nil {
		log.Fatalf("GetGeneratePromptConfigValue error opening file: %v\n", err)

		return &structs.ConfigGeneratePrompt{}, err
	}

	var config structs.ConfigGeneratePrompt

	err = json.Unmarshal(content, &config)

	if err != nil {
		log.Fatalf(" GetGeneratePromptConfigValue error parsing JSON: %v\n", err)

		return &structs.ConfigGeneratePrompt{}, err
	}

	return &config, nil
}

func (a *App) GetGenerateImageConfigValue(projectId string) (*structs.ConfigGenerateImage, error) {
	projectDetail, err := a.getProjectConfigPaths()

	if err != nil {
		log.Fatalf("GetGenerateImageConfigValue getProjectConfigPaths error getting directory: %v\n", err)

		return &structs.ConfigGenerateImage{}, err
	}

	content, err := os.ReadFile(projectDetail.UserProjectsDir + "/" + projectId + "/" + constants.APP_SETTING_GENERATE_IMAGE)

	if err != nil {
		log.Fatalf("GetGenerateImageConfigValue error opening file: %v\n", err)

		return &structs.ConfigGenerateImage{}, err
	}

	var config structs.ConfigGenerateImage

	err = json.Unmarshal(content, &config)

	if err != nil {
		log.Fatalf("GetGenerateImageConfigValue rror parsing JSON: %v\n", err)

		return &structs.ConfigGenerateImage{}, err
	}

	return &config, nil
}

func (a *App) StoreTrainingConfigValue(projectId string, value *structs.ConfigTraining) error {
	projectDetail, err := a.getProjectConfigPaths()

	if err != nil {
		log.Fatalf("StoreTrainingConfigValue getProjectConfigPaths error getting directory: %v\n", err)

		return err
	}

	file, err := os.OpenFile(projectDetail.UserProjectsDir+"/"+projectId+"/"+constants.APP_SETTING_TRAINING, os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0644)

	if err != nil {
		log.Fatalf("StoreTrainingConfigValue failed to open file: %v\n", err)

		return err
	}

	defer file.Close()

	encoder := json.NewEncoder(file)

	encoder.SetIndent("", "  ")

	err = encoder.Encode(&structs.ConfigTraining{
		Mode:        value.Mode,
		Model:       value.Model,
		URLLocal:    value.URLLocal,
		URLCloud:    value.URLCloud,
		APIKeyCloud: value.APIKeyCloud,
	})

	if err != nil {
		log.Fatalf("StoreTrainingConfigValue failed to write JSON: %v\n", err)

		return err
	}

	return nil
}

func (a *App) StoreGeneratePromptConfigValue(projectId string, value *structs.ConfigGeneratePrompt) error {
	projectDetail, err := a.getProjectConfigPaths()

	if err != nil {
		log.Fatalf("StoreGeneratePromptConfigValue getProjectConfigPaths error getting directory: %v\n", err)

		return err
	}

	file, err := os.OpenFile(projectDetail.UserProjectsDir+"/"+projectId+"/"+constants.APP_SETTING_PROMPT, os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0644)

	if err != nil {
		log.Fatalf("StoreGeneratePromptConfigValue failed to open file: %v\n", err)

		return err
	}

	defer file.Close()

	encoder := json.NewEncoder(file)

	encoder.SetIndent("", "  ")

	err = encoder.Encode(&structs.ConfigGeneratePrompt{
		Mode:        value.Mode,
		Model:       value.Model,
		URLLocal:    value.URLLocal,
		URLCloud:    value.URLCloud,
		APIKeyCloud: value.APIKeyCloud,
	})

	if err != nil {
		log.Fatalf("StoreGeneratePromptConfigValue failed to write JSON: %v\n", err)

		return err
	}

	return nil
}

func (a *App) StoreGenerateImageConfigValue(projectId string, value *structs.ConfigGenerateImage) error {
	projectDetail, err := a.getProjectConfigPaths()

	if err != nil {
		log.Fatalf("StoreGenerateImageConfigValue getProjectConfigPaths error getting directory: %v\n", err)

		return err
	}

	file, err := os.OpenFile(projectDetail.UserProjectsDir+"/"+projectId+"/"+constants.APP_SETTING_GENERATE_IMAGE, os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0644)

	if err != nil {
		log.Fatalf("StoreGenerateImageConfigValue failed to open file: %v\n", err)

		return err
	}

	defer file.Close()

	encoder := json.NewEncoder(file)

	encoder.SetIndent("", "  ")

	err = encoder.Encode(&structs.ConfigGenerateImage{
		Mode:            value.Mode,
		Model:           value.Model,
		URLLocal:        value.URLLocal,
		URLCloud:        value.URLCloud,
		APIKeyCloud:     value.APIKeyCloud,
		Steps:           value.Steps,
		DimensionWidth:  value.DimensionWidth,
		DimensionHeight: value.DimensionHeight,
	})

	if err != nil {
		log.Fatalf("StoreGenerateImageConfigValue failed to write JSON: %v\n", err)

		return err
	}

	return nil
}

func (a *App) IsPlatformMac() bool {
	return goRuntime.GOOS == "darwin"
}

func (a *App) Dump(item any) {
	prettyPrint(item)
}

func prettyPrint(data interface{}) {
	var p []byte

	p, err := json.MarshalIndent(data, "", "\t")

	if err != nil {
		fmt.Println(err)
		return
	}

	fmt.Printf("%s \n", p)
}
