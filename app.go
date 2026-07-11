package main

import (
	"bytes"
	"context"
	"encoding/base64"
	"encoding/csv"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"os/exec"
	"ubiquitous-funicular/constants"
	"ubiquitous-funicular/structs"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

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
		log.Fatalf("unable to locate user config directory: %s", err)

		return &structs.ProjectConfigPathStructure{}, err
	}

	projectsPath := userConfigDir + constants.APP_USER_CONFIG_DIR
	configTraining := "/" + constants.APP_SETTING_TRAINING
	configGeneratePrompt := "/" + constants.APP_SETTING_PROMPT
	configGenerateImage := "/" + constants.APP_SETTING_GENERATE_IMAGE
	tokenDatabase := "/" + constants.TOKEN_DATABASE

	return &structs.ProjectConfigPathStructure{
		ProjectPath:          projectsPath,
		ConfigTraining:       projectsPath + configTraining,
		ConfigGeneratePrompt: projectsPath + configGeneratePrompt,
		ConfigGenerateImage:  projectsPath + configGenerateImage,
		TokenDatabase:        projectsPath + tokenDatabase,
	}, nil
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx

	projectDetail, err := a.getProjectConfigPaths()

	if err != nil {
		log.Fatalf("startup getProjectConfigPaths error: %s", err)

		return
	}

	// fmt.Println("app user project directory: " + projectDetail.ProjectPath)
	// fmt.Println("app user training config file path: " + projectDetail.ConfigTraining)
	// fmt.Println("app user generate prompt config file path: " + projectDetail.ConfigGeneratePrompt)
	// fmt.Println("app user generate image config file path: " + projectDetail.ConfigGenerateImage)
	// fmt.Println("app user token database file path: " + projectDetail.TokenDatabase)

	a.checkProjectDir(projectDetail.ProjectPath)

	a.configureTokenDatabaseFile(projectDetail.TokenDatabase)

	a.configureTrainingConfig(projectDetail.ConfigTraining)

	a.configureGeneratePromptConfig(projectDetail.ConfigGeneratePrompt)

	a.configureGenerateImageConfig(projectDetail.ConfigGenerateImage)
}

func (a *App) checkProjectDir(path string) {
	_, err := os.Stat(path)

	if os.IsNotExist(err) {
		if err := os.Mkdir(path, os.ModePerm); err != nil {
			log.Fatalf("app checkProjectDir error in creating application project directory: %s", err)

			return
		}
	}
}

func (a *App) configureTokenDatabaseFile(path string) {
	_, err := os.Stat(path)

	if os.IsNotExist(err) {
		file, err := os.Create(path)

		if err != nil {
			log.Fatalf("app configureTokenDatabaseFile error in creating projects token database file: %s", err)

			return
		}

		defer file.Close()

		writer := csv.NewWriter(file)

		defer writer.Flush()

		header := []string{"tier", "ok", "module", "sub_module", "token_concept", "surabaya_specific", "poids_structurel", "xeno_index"}

		if err := writer.Write(header); err != nil {
			log.Fatalf("app configureTokenDatabaseFile error in writing token databse header: %s", err)

			return
		}
	}
}

func (a *App) configureTrainingConfig(path string) {
	_, err := os.Stat(path)

	if os.IsNotExist(err) {
		configTraining, err := os.Create(path)

		if err != nil {
			log.Fatalf("app configureTrainingConfig error in creating projects training config file: %s", err)

			return
		}

		defer configTraining.Close()

		defaultConfigTraining := structs.ConfigTraining{
			Mode:        constants.TrainImageMode.LocalValue(),
			Model:       "",
			URLLocal:    "",
			URLCloud:    "",
			APIKeyCloud: "",
		}

		encoder := json.NewEncoder(configTraining)
		encoder.SetIndent("", "    ")

		err = encoder.Encode(defaultConfigTraining)

		if err != nil {
			log.Fatalf("app configureTrainingConfig unable to write default training config: %s", err)

			return
		}
	}
}

func (a *App) configureGeneratePromptConfig(path string) {
	_, err := os.Stat(path)

	if os.IsNotExist(err) {
		configPrompt, err := os.Create(path)

		if err != nil {
			log.Fatalf("app configureGeneratePromptConfig error in creating projects generate prompt config file: %s", err)

			return
		}

		defer configPrompt.Close()

		defaultPromptConfig := structs.ConfigGeneratePrompt{
			Mode:        constants.GeneratePromptMode.LocalValue(),
			Model:       "",
			URLLocal:    "",
			URLCloud:    "",
			APIKeyCloud: "",
		}

		encoder := json.NewEncoder(configPrompt)
		encoder.SetIndent("", "    ")

		err = encoder.Encode(defaultPromptConfig)

		if err != nil {
			log.Fatalf("app configureGeneratePromptConfig unable to write default generate prompt config: %s", err)

			return
		}
	}
}

func (a *App) configureGenerateImageConfig(path string) {
	_, err := os.Stat(path)

	if os.IsNotExist(err) {
		configImage, err := os.Create(path)

		if err != nil {
			log.Fatalf("app configureGenerateImageConfig error in creating projects generate image config file: %s", err)

			return
		}

		defer configImage.Close()

		defaultImageConfig := structs.ConfigGenerateImage{
			Mode:        constants.GenerateImageMode.LocalValue(),
			Model:       "",
			URLLocal:    "",
			URLCloud:    "",
			APIKeyCloud: "",
		}

		encoder := json.NewEncoder(configImage)
		encoder.SetIndent("", "    ")

		err = encoder.Encode(defaultImageConfig)

		if err != nil {
			log.Fatalf("app configureGenerateImageConfig unable to write default application generate image config: %s", err)

			return
		}
	}
}

func (a *App) GeneratePrompt() (string, error) {
	promptConfig, err := a.GetGeneratePromptConfigValue()

	if err != nil {
		log.Fatalf("GeneratePrompt GetTrainingConfigValue error: %v", err)

		return "", err
	}

	var modelURL string

	if promptConfig.Mode == constants.TrainImageMode.LocalValue() {
		modelURL = promptConfig.URLLocal
	} else {
		modelURL = promptConfig.URLCloud
	}

	projectConfigPath, err := a.getProjectConfigPaths()

	if err != nil {
		log.Fatalf("GeneratePrompt getProjectConfigPaths error: %v", err)

		return "", err
	}

	pythonInterpreter := "python3"
	scriptPath := "python/generate_prompt.py"
	tokenDatabasePath := projectConfigPath.TokenDatabase

	cmd := exec.Command(
		pythonInterpreter,
		scriptPath,
		modelURL,
		promptConfig.Model,
		projectConfigPath.ProjectPath,
		tokenDatabasePath,
	)

	output, err := cmd.CombinedOutput()

	if err != nil {
		log.Fatalf("GeneratePrompt failed to execute script: %v\nOutput: %s", err, string(output))

		return "", err
	}

	return string(output), nil
}

func (a *App) DescriptionsToTokens(texts string) (string, error) {
	trainingConfig, err := a.GetTrainingConfigValue()

	if err != nil {
		log.Fatalf("DescriptionsToTokens GetTrainingConfigValue error: %v", err)

		return "", err
	}

	var modelURL string

	if trainingConfig.Mode == constants.TrainImageMode.LocalValue() {
		modelURL = trainingConfig.URLLocal
	} else {
		modelURL = trainingConfig.URLCloud
	}

	projectConfigPath, err := a.getProjectConfigPaths()

	if err != nil {
		log.Fatalf("DescriptionsToTokens getProjectConfigPaths error: %v", err)

		return "", err
	}

	pythonInterpreter := "python3"
	scriptPath := "python/descriptions_to_tokens.py"
	tokenDatabasePath := projectConfigPath.TokenDatabase

	cmd := exec.Command(
		pythonInterpreter,
		scriptPath,
		modelURL,
		trainingConfig.Model,
		projectConfigPath.ProjectPath,
		tokenDatabasePath,
		texts,
	)

	output, err := cmd.CombinedOutput()

	if err != nil {
		log.Fatalf("DescriptionsToTokens failed to execute script: %v\nOutput: %s", err, string(output))

		return "", err
	}

	return string(output), nil
}

func (a *App) StartImageTraining(imagePath string) (string, error) {
	trainingConfig, err := a.GetTrainingConfigValue()

	if err != nil {
		log.Fatalf("StartImageTraining GetTrainingConfigValue error: %v", err)

		return "", err
	}

	var modelURL string

	if trainingConfig.Mode == constants.TrainImageMode.LocalValue() {
		modelURL = trainingConfig.URLLocal
	} else {
		modelURL = trainingConfig.URLCloud
	}

	pythonInterpreter := "python3"
	scriptPath := "python/train_image.py"

	result, err := a.EncodeImagesFromPath([]string{imagePath})

	if err != nil {
		log.Fatalf("StartImageTraining EncodeImagesFromPath error: %v", err)

		return "", err
	}

	cmd := exec.Command(
		pythonInterpreter,
		scriptPath,
		modelURL, // this is the sys.argv[1] in python
		trainingConfig.Model,
	)

	var stdinBuf bytes.Buffer
	stdinBuf.WriteString(result[0])
	cmd.Stdin = &stdinBuf

	output, err := cmd.CombinedOutput()

	if err != nil {
		log.Fatalf("StartImageTraining failed to execute script: %v\nOutput: %s", err, string(output))

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
				DisplayName: "JPG",
				Pattern:     "*.jpg;*.jpeg",
			},
		},
	})

	if err != nil {
		log.Fatalf("unable to read selected images: %s", err)

		return nil, err
	}

	return path, nil
}

func (a *App) EncodeImagesFromPath(paths []string) ([]string, error) {
	imageData := make([]string, 0, len(paths))

	for _, path := range paths {
		data, err := os.ReadFile(path)

		if err != nil {
			log.Fatalf("unable to read selected images from the given paths: %s", err)

			return nil, err
		}

		imageData = append(imageData, base64.StdEncoding.EncodeToString(data))
	}

	return imageData, nil
}

func (a *App) GetTrainingConfigValue() (*structs.ConfigTraining, error) {
	projectDetail, err := a.getProjectConfigPaths()

	if err != nil {
		log.Fatalf("GetTrainingConfigValue getProjectConfigPaths error getting directory: %v", err)

		return &structs.ConfigTraining{}, err
	}

	content, err := os.ReadFile(projectDetail.ConfigTraining)

	if err != nil {
		log.Fatalf("GetTrainingConfigValue error opening file: %v", err)

		return &structs.ConfigTraining{}, err
	}

	var config structs.ConfigTraining

	err = json.Unmarshal(content, &config)

	if err != nil {
		log.Fatalf("GetTrainingConfigValue error parsing JSON: %v", err)

		return &structs.ConfigTraining{}, err
	}

	return &config, nil
}

func (a *App) GetGeneratePromptConfigValue() (*structs.ConfigGeneratePrompt, error) {
	projectDetail, err := a.getProjectConfigPaths()

	if err != nil {
		log.Fatalf("GetGeneratePromptConfigValue getProjectConfigPaths error getting directory: %v", err)

		return &structs.ConfigGeneratePrompt{}, err
	}

	content, err := os.ReadFile(projectDetail.ConfigGeneratePrompt)

	if err != nil {
		log.Fatalf("GetGeneratePromptConfigValue error opening file: %v", err)

		return &structs.ConfigGeneratePrompt{}, err
	}

	var config structs.ConfigGeneratePrompt

	err = json.Unmarshal(content, &config)

	if err != nil {
		log.Fatalf(" GetGeneratePromptConfigValue error parsing JSON: %v", err)

		return &structs.ConfigGeneratePrompt{}, err
	}

	return &config, nil
}

func (a *App) GetGenerateImageConfigValue() (*structs.ConfigGenerateImage, error) {
	projectDetail, err := a.getProjectConfigPaths()

	if err != nil {
		log.Fatalf("GetGenerateImageConfigValue getProjectConfigPaths error getting directory: %v", err)

		return &structs.ConfigGenerateImage{}, err
	}

	content, err := os.ReadFile(projectDetail.ConfigGenerateImage)

	if err != nil {
		log.Fatalf("GetGenerateImageConfigValue error opening file: %v", err)

		return &structs.ConfigGenerateImage{}, err
	}

	var config structs.ConfigGenerateImage

	err = json.Unmarshal(content, &config)

	if err != nil {
		log.Fatalf("GetGenerateImageConfigValue rror parsing JSON: %v", err)

		return &structs.ConfigGenerateImage{}, err
	}

	return &config, nil
}

func (a *App) StoreTrainingConfigValue(value *structs.ConfigTraining) error {
	projectDetail, err := a.getProjectConfigPaths()

	if err != nil {
		log.Fatalf("StoreTrainingConfigValue getProjectConfigPaths error getting directory: %v", err)

		return err
	}

	file, err := os.OpenFile(projectDetail.ConfigTraining, os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0644)

	if err != nil {
		log.Fatalf("StoreTrainingConfigValue failed to open file: %v", err)

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
		log.Fatalf("StoreTrainingConfigValue failed to write JSON: %v", err)

		return err
	}

	return nil
}

func (a *App) StoreGeneratePromptConfigValue(value *structs.ConfigGeneratePrompt) error {
	projectDetail, err := a.getProjectConfigPaths()

	if err != nil {
		log.Fatalf("StoreGeneratePromptConfigValue getProjectConfigPaths error getting directory: %v", err)

		return err
	}

	file, err := os.OpenFile(projectDetail.ConfigGeneratePrompt, os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0644)

	if err != nil {
		log.Fatalf("StoreGeneratePromptConfigValue failed to open file: %v", err)

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
		log.Fatalf("StoreGeneratePromptConfigValue failed to write JSON: %v", err)

		return err
	}

	return nil
}

func (a *App) StoreGenerateImageConfigValue(value *structs.ConfigGenerateImage) error {
	projectDetail, err := a.getProjectConfigPaths()

	if err != nil {
		log.Fatalf("StoreGenerateImageConfigValue getProjectConfigPaths error getting directory: %v", err)

		return err
	}

	file, err := os.OpenFile(projectDetail.ConfigGenerateImage, os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0644)

	if err != nil {
		log.Fatalf("StoreGenerateImageConfigValue failed to open file: %v", err)

		return err
	}

	defer file.Close()

	encoder := json.NewEncoder(file)

	encoder.SetIndent("", "  ")

	err = encoder.Encode(&structs.ConfigGenerateImage{
		Mode:        value.Mode,
		Model:       value.Model,
		URLLocal:    value.URLLocal,
		URLCloud:    value.URLCloud,
		APIKeyCloud: value.APIKeyCloud,
	})

	if err != nil {
		log.Fatalf("StoreGenerateImageConfigValue failed to write JSON: %v", err)

		return err
	}

	return nil
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
