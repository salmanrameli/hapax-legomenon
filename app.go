package main

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"os"

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

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
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
		return nil, err
	}

	imageData := make([]string, 0, len(path))

	for _, item := range path {
		data, err := os.ReadFile(item)

		if err != nil {
			fmt.Printf("unable to read selected image(s)")

			return nil, err
		}

		imageData = append(imageData, base64.StdEncoding.EncodeToString(data))
	}

	return imageData, nil
}
