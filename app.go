package main

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"os/exec"
	"ubiquitous-funicular/constants"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

type ProjectConfigPathStructure struct {
	ProjectPath          string
	ConfigTraining       string
	ConfigGeneratePrompt string
	ConfigGenerateImage  string
}

type ConfigTraining struct {
	Mode        string `json:"mode"`
	URLLocal    string `json:"url_local"`
	URLCloud    string `json:"url_cloud"`
	APIKeyCloud string `json:"api_key_cloud"`
}

type ConfigGeneratePrompt struct {
	Mode        string `json:"mode"`
	URLLocal    string `json:"url_local"`
	URLCloud    string `json:"url_cloud"`
	APIKeyCloud string `json:"api_key_cloud"`
}

type ConfigGenerateImage struct {
	Mode        string `json:"mode"`
	URLLocal    string `json:"url_local"`
	URLCloud    string `json:"url_cloud"`
	APIKeyCloud string `json:"api_key_cloud"`
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

func (a *App) getProjectConfigPaths() (*ProjectConfigPathStructure, error) {
	userConfigDir, err := os.UserConfigDir()

	if err != nil {
		fmt.Println("unable to locate user config directory", err)

		return &ProjectConfigPathStructure{}, err
	}

	projectsPath := userConfigDir + constants.APP_USER_CONFIG_DIR
	configTraining := "/" + constants.APP_SETTING_TRAINING
	configGeneratePrompt := "/" + constants.APP_SETTING_PROMPT
	configGenerateImage := "/" + constants.APP_SETTING_GENERATE_IMAGE

	return &ProjectConfigPathStructure{
		ProjectPath:          projectsPath,
		ConfigTraining:       projectsPath + configTraining,
		ConfigGeneratePrompt: projectsPath + configGeneratePrompt,
		ConfigGenerateImage:  projectsPath + configGenerateImage,
	}, nil
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx

	projectDetail, err := a.getProjectConfigPaths()

	if err != nil {
		fmt.Println("startup getProjectConfigPaths error", err)

		return
	}

	fmt.Println("app user project directory: " + projectDetail.ProjectPath)
	fmt.Println("app user training config file path: " + projectDetail.ConfigTraining)
	fmt.Println("app user generate prompt config file path: " + projectDetail.ConfigGeneratePrompt)
	fmt.Println("app user generate image config file path: " + projectDetail.ConfigGenerateImage)

	_, err = os.Stat(projectDetail.ProjectPath)

	if os.IsNotExist(err) {
		if err := os.Mkdir(projectDetail.ProjectPath, os.ModePerm); err != nil {
			fmt.Println("app startup error in creating application project directory", err)

			return
		}

		configTraining, err := os.Create(projectDetail.ConfigTraining)

		if err != nil {
			fmt.Println("app startup error in creating projects training config file", err)

			return
		}

		defer configTraining.Close()

		defaultConfigTraining := ConfigTraining{
			Mode:        constants.TrainImageMode.LocalValue(),
			URLLocal:    "",
			URLCloud:    "",
			APIKeyCloud: "",
		}

		encoder := json.NewEncoder(configTraining)
		encoder.SetIndent("", "    ")

		err = encoder.Encode(defaultConfigTraining)

		if err != nil {
			fmt.Println("unable to write default training config", err)

			return
		}

		configPrompt, err := os.Create(projectDetail.ConfigGeneratePrompt)

		if err != nil {
			fmt.Println("app startup error in creating projects generate prompt config file", err)

			return
		}

		defer configPrompt.Close()

		defaultPromptConfig := ConfigGeneratePrompt{
			Mode:        constants.GeneratePromptMode.LocalValue(),
			URLLocal:    "",
			URLCloud:    "",
			APIKeyCloud: "",
		}

		encoder = json.NewEncoder(configPrompt)
		encoder.SetIndent("", "    ")

		err = encoder.Encode(defaultPromptConfig)

		if err != nil {
			fmt.Println("unable to write default generate prompt config", err)

			return
		}

		configImage, err := os.Create(projectDetail.ConfigGenerateImage)

		if err != nil {
			fmt.Println("app startup error in creating projects generate image config file", err)

			return
		}

		defer configImage.Close()

		defaultImageConfig := ConfigGenerateImage{
			Mode:        constants.GenerateImageMode.LocalValue(),
			URLLocal:    "",
			URLCloud:    "",
			APIKeyCloud: "",
		}

		encoder = json.NewEncoder(configImage)
		encoder.SetIndent("", "    ")

		err = encoder.Encode(defaultImageConfig)

		if err != nil {
			fmt.Println("unable to write default application generate image config", err)

			return
		}
	}
}

func (a *App) StartImageTraining() (string, error) {
	trainingConfig, err := a.GetTrainingConfigValue()

	if err != nil {
		log.Fatalf("StartImageTraining GetAppConfigValue error: %v", err)

		return "", err
	}

	if trainingConfig.Mode == constants.TrainImageMode.LocalValue() {

	} else {

	}

	pythonInterpreter := "python3"
	scriptPath := "python/train_image.py"
	arg1 := "hello"
	arg2 := "world"

	cmd := exec.Command(pythonInterpreter, scriptPath, arg1, arg2)

	output, err := cmd.CombinedOutput()
	if err != nil {
		log.Fatalf("Failed to execute script: %v\nOutput: %s", err, string(output))

		return "", err
	}

	fmt.Println("Python Script Output:")
	fmt.Println(string(output))

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
		fmt.Printf("unable to read selected images")
		return nil, err
	}

	return path, nil
}

func (a *App) EncodeImagesFromPath(paths []string) ([]string, error) {
	imageData := make([]string, 0, len(paths))

	for _, path := range paths {
		data, err := os.ReadFile(path)

		if err != nil {
			fmt.Printf("unable to read selected images from the given paths")
			return nil, err
		}

		imageData = append(imageData, base64.StdEncoding.EncodeToString(data))
	}

	return imageData, nil
}

func (a *App) GetTrainingConfigValue() (*ConfigTraining, error) {
	projectDetail, err := a.getProjectConfigPaths()

	if err != nil {
		log.Fatalf("GetTrainingConfigValue getProjectConfigPaths error getting directory: %v", err)

		return &ConfigTraining{}, err
	}

	content, err := os.ReadFile(projectDetail.ConfigTraining)

	if err != nil {
		log.Fatalf("GetTrainingConfigValue error opening file: %v", err)

		return &ConfigTraining{}, err
	}

	var config ConfigTraining

	err = json.Unmarshal(content, &config)

	if err != nil {
		log.Fatalf("GetTrainingConfigValue error parsing JSON: %v", err)

		return &ConfigTraining{}, err
	}

	return &config, nil
}

func (a *App) GetGeneratePromptConfigValue() (*ConfigGeneratePrompt, error) {
	projectDetail, err := a.getProjectConfigPaths()

	if err != nil {
		log.Fatalf("GetGeneratePromptConfigValue getProjectConfigPaths error getting directory: %v", err)

		return &ConfigGeneratePrompt{}, err
	}

	content, err := os.ReadFile(projectDetail.ConfigGeneratePrompt)

	if err != nil {
		log.Fatalf("GetGeneratePromptConfigValue error opening file: %v", err)

		return &ConfigGeneratePrompt{}, err
	}

	var config ConfigGeneratePrompt

	err = json.Unmarshal(content, &config)

	if err != nil {
		log.Fatalf(" GetGeneratePromptConfigValue error parsing JSON: %v", err)

		return &ConfigGeneratePrompt{}, err
	}

	return &config, nil
}

func (a *App) GetGenerateImageConfigValue() (*ConfigGenerateImage, error) {
	projectDetail, err := a.getProjectConfigPaths()

	if err != nil {
		log.Fatalf("GetGenerateImageConfigValue getProjectConfigPaths error getting directory: %v", err)

		return &ConfigGenerateImage{}, err
	}

	content, err := os.ReadFile(projectDetail.ConfigGenerateImage)

	if err != nil {
		log.Fatalf("GetGenerateImageConfigValue error opening file: %v", err)

		return &ConfigGenerateImage{}, err
	}

	var config ConfigGenerateImage

	err = json.Unmarshal(content, &config)

	if err != nil {
		log.Fatalf("GetGenerateImageConfigValue rror parsing JSON: %v", err)

		return &ConfigGenerateImage{}, err
	}

	return &config, nil
}

func (a *App) StoreTrainingConfigValue(value *ConfigTraining) error {
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

	err = encoder.Encode(&ConfigTraining{
		Mode:        value.Mode,
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

func (a *App) StoreGeneratePromptConfigValue(value *ConfigGeneratePrompt) error {
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

	err = encoder.Encode(&ConfigGeneratePrompt{
		Mode:        value.Mode,
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

func (a *App) StoreGenerateImageConfigValue(value *ConfigGenerateImage) error {
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

	err = encoder.Encode(&ConfigGenerateImage{
		Mode:        value.Mode,
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
