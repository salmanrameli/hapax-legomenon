export interface ICurrentProjectDetail {
    id: string,
    name: string
}

export interface ISettingTraining {
    data: IConfigTraining,
    onChangeSource: (source: string) => void
    onSaveChanges: (data: IConfigTraining) => void
}

export interface ISettingGeneratePrompt {
    data: IConfigGeneratePrompt
    onChangeSource: (source: string) => void
    onSaveChanges: (data: IConfigGeneratePrompt) => void
}

export interface ISettingGenerateImage {
    data: IConfigGenerateImage,
    onChangeSource: (source: string) => void
    onSaveChanges: (data: IConfigGenerateImage) => void
    onChangeDimension: (dimension: number) => void
}

export interface IConfigTrainingParams {
    source: string
    defaultValue: IConfigTraining
    onChangeConfig: (data: IConfigTraining) => void
    onSaveChanges: () => void
}

export interface IConfigGeneratePromptParams {
    source: string
    defaultValue: IConfigGeneratePrompt
    onChangeConfig: (data: IConfigGeneratePrompt) => void
    onSaveChanges: () => void
}

export interface IConfigGenerateImageParams {
    source: string
    defaultValue: IConfigGenerateImage
    onChangeConfig: (data: IConfigGenerateImage) => void
    onSaveChanges: () => void
}

export interface IConfigTraining {
    Mode: string,
    Model: string,
    URLLocal: string
    URLCloud: string
    APIKeyCloud: string
}

export interface IConfigGeneratePrompt {
    Mode: string,
    Model: string,
    URLLocal: string
    URLCloud: string
    APIKeyCloud: string
}

export interface IConfigGenerateImage {
    Mode: string,
    Model: string,
    URLLocal: string
    URLCloud: string
    APIKeyCloud: string
    Steps: number,
    Dimension: number
}