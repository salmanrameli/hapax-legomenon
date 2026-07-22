package constants

const version = "0.2.6-alpha"

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

const DEFAULT_POV_INSTRUCTION = `Conduct a visual inventory of this image and present the findings as a structured report or article.

Format the entire response strictly in raw HTML. Do not use Markdown or any fancy HTML tags (such as <p>, <ul>, <b>, or <div>). You are only allowed to use HTML heading tags (e.g., <h1>, <h2>, <h3>) for the report title and section headers, and <br /> tags to create new lines and separate the content. 

Structure your report by working through the following seven layers in sequence. Use a <h3> heading tag for each category title, followed by a <br /> tag, and then your analysis. Separate each category from the next using two <br /> tags. 

Write EXACTLY two sentences per layer — no more for the rich layers, no less for the sparse ones. Focus on the following parameters for each section:
1. Light: quality, direction, color temperature, shadows.
2. Space: depth, scale, geometry, framing.
3. Materials and surfaces: texture, reflectance, wear, color.
4. Human presence or absence: body position, gaze direction, who is seen and who sees, traces, density.
5. Time: period markers, decay, weathering, motion blur.
6. Capture: grain, focus, lens distortion, camera movement, apparent intent of the operator.
7. Image condition: what kind of looking produced this frame: posed or caught, watched or unwatched, archival or live, addressed to someone or to no one. Describe only what the making of this frame implies, not a story.

Name what is visible, and name how it appears to have been made. Do not narrate a story or guess identities.
`
