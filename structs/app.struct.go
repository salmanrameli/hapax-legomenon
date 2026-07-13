package structs

type ProjectConfigPathStructure struct {
	ProjectPath          string
	ArchivedTokens       string
	ConfigTraining       string
	ConfigGeneratePrompt string
	ConfigGenerateImage  string
	TokenDatabase        string
}

type ConfigTraining struct {
	Mode        string `json:"mode"`
	Model       string `json:"model"`
	URLLocal    string `json:"url_local"`
	URLCloud    string `json:"url_cloud"`
	APIKeyCloud string `json:"api_key_cloud"`
}

type ConfigGeneratePrompt struct {
	Mode        string `json:"mode"`
	Model       string `json:"model"`
	URLLocal    string `json:"url_local"`
	URLCloud    string `json:"url_cloud"`
	APIKeyCloud string `json:"api_key_cloud"`
}

type ConfigGenerateImage struct {
	Mode        string `json:"mode"`
	Model       string `json:"model"`
	URLLocal    string `json:"url_local"`
	URLCloud    string `json:"url_cloud"`
	APIKeyCloud string `json:"api_key_cloud"`
}

type TokenDatabase struct {
	Tier             string `json:"tier"`
	Ok               string `json:"ok"`
	Module           string `json:"module"`
	SubModule        string `json:"sub_module"`
	TokenConcept     string `json:"token_concept"`
	SurabayaSpecific string `json:"surabaya_specific"`
	PoidsStructurel  string `json:"poids_structurel"`
	XenoIndex        string `json:"xeno_index"`
}

type LocalModelResponseItem struct {
	Model string `json:"model"`
	Name  string `json:"name"`
}

type LocalModelResponseArray struct {
	Models []LocalModelResponseItem `json:"models"`
}
