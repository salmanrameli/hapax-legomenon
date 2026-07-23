export interface ITrainingResult {
    countImage: number
    totalImage: number
    images: string[]
    isFinishedProcessing: boolean
    responses: IImageAnalysisResponse[]
    elapsedSeconds: number[]
    onStartProcessingText: () => void
    customPOV: string
}

export interface IImageAnalysisResponse {
    index: number,
    text: string
}

export interface ITrainingSelectResult {
    results: IImageAnalysisResponse[]
    goBack: () => void
}

export interface ITextToToken {
    countProcessedTexts: number
    totalTexts: number
}