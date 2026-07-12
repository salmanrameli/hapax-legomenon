package structs

type ImageGenRequest struct {
	Model   string                 `json:"model"`
	Prompt  string                 `json:"prompt"`
	Stream  bool                   `json:"stream"`
	Options map[string]interface{} `json:"options,omitempty"`
}

type ImageGenResponse struct {
	// Response string `json:"response"`
	Image string `json:"image"`
	Done  bool   `json:"done"`
}
