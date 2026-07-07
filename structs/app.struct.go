package structs

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
