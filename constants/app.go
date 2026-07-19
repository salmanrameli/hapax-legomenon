package constants

const version = "0.2.4-alpha"

const (
	APP_NAME                   = "Hapax-Legomenon"
	APP_USER_CONFIG_DIR        = "/" + APP_NAME
	APP_USER_PROJECTS_DIR      = "/projects"
	APP_CREATED_TOKENS_DIR     = "/archived-tokens"
	APP_SETTING_TRAINING       = "settings_training.json"
	APP_SETTING_PROMPT         = "settings_prompt.json"
	APP_SETTING_GENERATE_IMAGE = "settings_generate_image.json"
	APP_SETTING_USER_PROJECTS  = "settings_user_projects.json"
	TOKEN_DATABASE             = "prompt_database.csv"
	POV_TXT                    = "pov.txt"
)

const (
	LOCAL_DEFAULT_URL = "http://localhost:11434"
	MAX_UPLOAD_IMAGES = 5
)

const (
	GENERATE_IMAGE_DEFAULT_STEPS     = 20
	GENERATE_IMAGE_DEFAULT_DIMENSION = 512
)

const DEFAULT_POV_INSTRUCTION = `Conduct a visual inventory of this image. Do not use any formatting style. The only exception is using <br /> tag to separate between each categories.
Write the title of each category (light, space, materials and surfaces, human presence or absence, time, capture, image condition), followed by colon, and finally the result from the category. Separate each categories with two <br /> tags.
Work through these layers in sequence. Give EXACTLY two sentences per layer — no more for the rich layers, no less for the sparse ones.
(1) light — quality, direction, color temperature, shadows;
(2) space — depth, scale, geometry, framing;
(3) materials and surfaces — texture, reflectance, wear, color;
(4) human presence or absence — body position, gaze direction, who is seen and who sees, traces, density;
(5) time — period markers, decay, weathering, motion blur;
(6) capture — grain, focus, lens distortion, camera movement, apparent intent of the operator;
(7) image condition — what kind of looking produced this frame: posed or caught, watched or unwatched, archival or live, addressed to someone or to no one. Describe only what the making of this frame implies, not a story.
Name what is visible, and name how it appears to have been made. Do not narrate a story or guess identities.
`
