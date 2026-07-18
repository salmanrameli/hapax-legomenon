package structs

type ProjectConfigPathStructure struct {
	ProjectPath        string
	ArchivedTokensDir  string
	UserProjectsDir    string
	ConfigUserProjects string
	POVFile            string
}

type UserProjects struct {
	Selected string            `json:"selected"`
	Options  []UserProjectItem `json:"options"`
}

type UserProjectItem struct {
	ID   string `json:"id"`
	Name string `json:"name"`
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
	Mode            string `json:"mode"`
	Model           string `json:"model"`
	URLLocal        string `json:"url_local"`
	URLCloud        string `json:"url_cloud"`
	APIKeyCloud     string `json:"api_key_cloud"`
	Steps           uint8  `json:"steps"`
	DimensionWidth  uint16 `json:"dimension_width"`
	DimensionHeight uint16 `json:"dimension_height"`
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
	Model        string   `json:"model"`
	Name         string   `json:"name"`
	Capabilities []string `json:"capabilities"`
}

type LocalModelResponseArray struct {
	Models []LocalModelResponseItem `json:"models"`
}

type AvailableLocalModels struct {
	Vision     []LocalModelResponseItem
	Completion []LocalModelResponseItem
	Image      []LocalModelResponseItem
}
