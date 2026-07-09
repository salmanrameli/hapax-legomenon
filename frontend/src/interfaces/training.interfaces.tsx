export interface ITrainingResult {
    countImage: number
    totalImage: number
    images: string[]
    isFinishedProcessing: boolean
    responses: string[]
    elapsedSeconds: number[]
}