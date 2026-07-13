package constants

const (
	APP_NAME                   = "Hapax-Legomenon"
	APP_USER_CONFIG_DIR        = "/" + APP_NAME
	APP_CREATED_TOKENS_DIR     = APP_USER_CONFIG_DIR + "/archived-tokens"
	APP_SETTING_TRAINING       = "settings_training.json"
	APP_SETTING_PROMPT         = "settings_prompt.json"
	APP_SETTING_GENERATE_IMAGE = "settings_generate_image.json"
	TOKEN_DATABASE             = "prompt_database.csv"
)

const (
	LOCAL_DEFAULT_URL = "http://localhost:11434"
)

const (
	GENERATE_IMAGE_DEFAULT_STEPS     = 20
	GENERATE_IMAGE_DEFAULT_DIMENSION = 512
)
