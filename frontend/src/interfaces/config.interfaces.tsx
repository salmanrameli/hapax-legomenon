export interface ICurrentProjectDetail {
    id: string
    name: string
}

export interface IAvailableModels {
    Label: string
    Value: string
}

export interface ISettingTraining {
    data: IConfigTraining
    onChangeSource: (source: string) => void
    onSaveChanges: (data: IConfigTraining) => void
}

export interface ISettingGeneratePrompt {
    data: IConfigGeneratePrompt
    onChangeSource: (source: string) => void
    onSaveChanges: (data: IConfigGeneratePrompt) => void
}

export interface ISettingGenerateImage {
    data: IConfigGenerateImage
    onChangeSource: (source: string) => void
    onSaveChanges: (data: IConfigGenerateImage) => void
    onChangeDimensionWidth: (dimension: number) => void
    onChangeDimensionHeight: (dimension: number) => void
}

export interface IConfigTrainingParams {
    source: string
    defaultValue: IConfigTraining
    onChangeConfig: (data: IConfigTraining) => void
    onSaveChanges: () => void
    availableVisionModels: IAvailableModels[]
    availableCompletionModels: IAvailableModels[]
}

export interface IConfigGeneratePromptParams {
    source: string
    defaultValue: IConfigGeneratePrompt
    onChangeConfig: (data: IConfigGeneratePrompt) => void
    onSaveChanges: () => void
    availableModels: IAvailableModels[]
}

export interface IConfigGenerateImageParams {
    source: string
    defaultValue: IConfigGenerateImage
    onChangeConfig: (data: IConfigGenerateImage) => void
    onSaveChanges: () => void
    availableModels: IAvailableModels[]
}

export interface IConfigTraining {
    Mode: string
    ModelImageAnalysis: string
    ModelTokenizingTexts: string
    URLLocal: string
    URLCloud: string
    APIKeyCloud: string
}

export interface IConfigGeneratePrompt {
    Mode: string
    Model: string
    URLLocal: string
    URLCloud: string
    APIKeyCloud: string
}

export interface IConfigGenerateImage {
    Mode: string
    Model: string
    URLLocal: string
    URLCloud: string
    APIKeyCloud: string
    Steps: number,
    DimensionWidth: number,
    DimensionHeight: number,
}