package main

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log"
	"os"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

type AppConfig struct {
	ModeGeneratePrompt string `json:"mode_generate_prompt"`
	ModeGenerateImage  string `json:"mode_generate_image"`
}

type LocalConfig struct {
	URLGeneratePrompt string `json:"url_generate_prompt"`
	URLGenerateImage  string `json:"url_generate_image"`
}

type CloudConfig struct {
	URLGeneratePrompt      string `json:"url_generate_prompt"`
	API_KEY_GeneratePrompt string `json:"api_key_generate_prompt"`
	URLGenerateImage       string `json:"url_generate_image"`
	API_KEY_GenerateImage  string `json:"api_key_generate_image"`
}

type ProjectConfigPathStructure struct {
	ProjectPath        string
	ProjectConfig      string
	ProjectConfigLocal string
	ProjectConfigCloud string
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

	projectsPath := userConfigDir + APP_USER_CONFIG_DIR
	projectsConfig := "/" + APP_SETTING
	projectsConfigLocal := "/" + APP_SETTING_LOCAL
	projectsConfigCloud := "/" + APP_SETTING_CLOUD

	return &ProjectConfigPathStructure{
		ProjectPath:        projectsPath,
		ProjectConfig:      projectsPath + projectsConfig,
		ProjectConfigLocal: projectsPath + projectsConfigLocal,
		ProjectConfigCloud: projectsPath + projectsConfigCloud,
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

	fmt.Println("app user global config directory: " + projectDetail.ProjectConfig)
	fmt.Println("app user local config directory: " + projectDetail.ProjectConfigLocal)
	fmt.Println("app user cloud config directory: " + projectDetail.ProjectConfigCloud)

	_, err = os.Stat(projectDetail.ProjectPath)

	if os.IsNotExist(err) {
		if err := os.Mkdir(projectDetail.ProjectPath, os.ModePerm); err != nil {
			fmt.Println("app startup error in creating application project directory", err)

			return
		}

		appConfig, err := os.Create(projectDetail.ProjectConfig)

		if err != nil {
			fmt.Println("app startup error in creating projects global config file", err)

			return
		}

		defer appConfig.Close()

		defaultAppConfig := AppConfig{
			ModeGeneratePrompt: "local",
			ModeGenerateImage:  "local",
		}

		encoder := json.NewEncoder(appConfig)
		encoder.SetIndent("", "    ")

		err = encoder.Encode(defaultAppConfig)

		if err != nil {
			fmt.Println("unable to write default application config", err)

			return
		}

		localConfig, err := os.Create(projectDetail.ProjectConfigLocal)

		if err != nil {
			fmt.Println("app startup error in creating projects local config file", err)

			return
		}

		defer localConfig.Close()

		defaultLocalConfig := LocalConfig{
			URLGeneratePrompt: "",
			URLGenerateImage:  "",
		}

		encoder = json.NewEncoder(localConfig)
		encoder.SetIndent("", "    ")

		err = encoder.Encode(defaultLocalConfig)

		if err != nil {
			fmt.Println("unable to write default application local config", err)

			return
		}

		cloudConfig, err := os.Create(projectDetail.ProjectConfigCloud)

		if err != nil {
			fmt.Println("app startup error in creating projects cloud config file", err)

			return
		}

		defer cloudConfig.Close()

		defaultCloudConfig := CloudConfig{
			URLGeneratePrompt:      "",
			API_KEY_GeneratePrompt: "",
			URLGenerateImage:       "",
			API_KEY_GenerateImage:  "",
		}

		encoder = json.NewEncoder(cloudConfig)
		encoder.SetIndent("", "    ")

		err = encoder.Encode(defaultCloudConfig)

		if err != nil {
			fmt.Println("unable to write default application cloud config", err)

			return
		}
	}
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

func (a *App) GetGeneratePromptConfigValue() (*AppConfig, error) {
	projectDetail, err := a.getProjectConfigPaths()

	if err != nil {
		log.Fatalf("GetGeneratePromptConfigValue projectDetail error getting directory: %v", err)

		return &AppConfig{}, err
	}

	content, err := os.ReadFile(projectDetail.ProjectConfig)

	if err != nil {
		log.Fatalf("GetGeneratePromptConfigValue error opening file: %v", err)

		return &AppConfig{}, err
	}

	var config AppConfig

	err = json.Unmarshal(content, &config)

	if err != nil {
		log.Fatalf("Error parsing JSON: %v", err)

		return &AppConfig{}, err
	}

	return &config, nil
}

func (a *App) StoreGeneratePromptConfig(value *AppConfig) error {
	projectDetail, err := a.getProjectConfigPaths()

	if err != nil {
		log.Fatalf("StoreGeneratePromptConfig error: %v", err)

		return err
	}

	file, err := os.OpenFile(projectDetail.ProjectConfig, os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0644)

	if err != nil {
		log.Fatalf("StoreGeneratePromptConfig failed to open file: %v", err)

		return err
	}

	defer file.Close()

	encoder := json.NewEncoder(file)

	encoder.SetIndent("", "  ")

	err = encoder.Encode(&AppConfig{
		ModeGeneratePrompt: value.ModeGeneratePrompt,
		ModeGenerateImage:  value.ModeGenerateImage,
	})

	if err != nil {
		log.Fatalf("StoreGeneratePromptConfig failed to write JSON: %v", err)

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
