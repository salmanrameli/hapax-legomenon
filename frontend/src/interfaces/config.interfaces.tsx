export interface IAppConfig {
    ModeGeneratePrompt: string,
    ModeGenerateImage: string
}

export interface ISettingGeneratePrompt {
    onChangeSource: (source: string) => void
}

export interface ISettingGenerateImage {
    onChangeSource: (source: string) => void
}

export interface IConfigPrompts {
    promptSource: string
}

export interface IConfigImage {
    imageSource: string
}

export interface ILocalConfig {
    URLGeneratePrompt: string
    URLGenerateImage: string
}

export interface ICloudConfig {
    URLGeneratePrompt: string,
    API_KEY_GeneratePrompt: string,
    URLGenerateImage: string,
    API_KEY_GenerateImage: string
}