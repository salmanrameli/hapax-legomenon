export const Mode = {
    MODE_HOME: 1,
    MODE_TRAIN: 2,
    MODE_GENERATE_PROMPT: 3,
    MODE_SETTING_PROMPT: 4,
    MODE_SETTING_IMAGE: 5,
    MODE_SETTING_TRAINING: 6
}

export const TrainingOptions = {
    LOCAL: {label: "Local", value: "local"},
    CLOUD: {label: "Cloud", value: "cloud"}
}

export const GeneratePromptOptions = {
    LOCAL: {label: "Local", value: "local"},
    CLOUD: {label: "Cloud", value: "cloud"}
}

export const GenerateImageOptions = {
    LOCAL: {label: "Local", value: "local"},
    CLOUD: {label: "Cloud", value: "cloud"}
}

export const TrainingMode = {
    MODE_HOME: 1,
    MODE_RESULT: 2,
    MODE_SELECT_RESULTS: 3,
    MODE_PROCESSING_TEXTS_TO_TOKENS: 4,
    MODE_FINISHED: 5
}

export const GenerateMode = {
    MODE_DEFAULT: 11,
    MODE_GENERATING_PROMPT: 12,
    MODE_GENERATING_IMAGE: 13
}