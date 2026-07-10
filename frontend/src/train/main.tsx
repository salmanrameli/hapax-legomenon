import { useState } from "react"
import { SelectImages, EncodeImagesFromPath, StartImageTraining, Dump } from "../../wailsjs/go/main/App"
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CarouselPreview from "./carousel_preview";
import { PlayFill } from "react-bootstrap-icons";
import { TrainingMode } from "../constants/mode";
import Result from "./result";
import { IImageAnalysisResponse } from "../interfaces/training.interfaces";

function Main() {
    const [imagePaths, setImagePaths] = useState<string[]>([])
    const [previews, setPreviews] = useState<string[]>([])
    const [mode, setMode] = useState<number>(TrainingMode.MODE_HOME)
    const [responses, setResponses] = useState<IImageAnalysisResponse[]>([])
    const [isFinishedProcessing, setIsFinishedProcessing] = useState<boolean>(false)
    const [processCount, setProcessCount] = useState<number>(0)
    const [elapsedTimes, setElapsedTimes] = useState<number[]>([])

    function handleOpenFileDialog() {    
        SelectImages().then((paths) => {
            loadImages(paths)

            setImagePaths(paths)
        })
    }

    function loadImages(paths: string[]) {
        EncodeImagesFromPath(paths).then((encodedImages: string[]) => {
            const imageUrls: string[] = []

            encodedImages.map((base64Data: string) => {
                const byteChars = atob(base64Data)
                const byteNumbers = new Array(byteChars.length)

                for (let i = 0; i < byteChars.length; i++) {
                    byteNumbers[i] = byteChars.charCodeAt(i)
                }
                
                const byteArray = new Uint8Array(byteNumbers)
                
                const imageBlob = new Blob([byteArray], { type: 'image/jpeg' })

                imageUrls.push(URL.createObjectURL(imageBlob))
            })

            setPreviews(imageUrls)
        })
    }

    async function startTraining() {
        setMode(TrainingMode.MODE_RESULT)

        let countProcessedImages = 0
        let countIndex = 0

        for (const item of imagePaths) {
            const start = performance.now();

            await StartImageTraining(item).then((value: string) => {
                if (value) {
                    setResponses((prevItems) => [...prevItems, {
                        index: countIndex++,
                        text: value
                    }])

                    setProcessCount(++countProcessedImages)

                    const end = performance.now();

                    const elapsedSeconds = (end - start) / 1000;

                    setElapsedTimes((prevItems) => [...prevItems, elapsedSeconds])

                    if (countProcessedImages == imagePaths.length) {
                        setIsFinishedProcessing(true)
                    }
                }
            }).then(() => {
                if (processCount == imagePaths.length) {
                    setIsFinishedProcessing(true)
                }
            })
        }
    }

    const removeImage = (urlToRemove: any, index: number) => {
        setImagePaths((prev) => prev.filter((_, i) => i !== index)) // remove image from array of paths to be processed by the LLM

        setPreviews((prev) => prev.filter((_, i) => i !== index)) // remove image from carousel preview

        URL.revokeObjectURL(urlToRemove)
    };

    function render() {
        switch(mode) {
            case (TrainingMode.MODE_HOME):
                return (
                    <Row>
                        <Col className="col-12">
                            <div className="d-flex mt-2 gap-2 flex-wrap justify-content-center p-3 border border-dark border-2">
                                {previews.length == 0 ?
                                    <div className="d-flex justify-content-center align-items-center" style={{height: "400px", width:"100%"}}>
                                        <Button size="lg" onClick={_ => handleOpenFileDialog()} variant="dark">Import Images</Button>
                                    </div>
                                    : 
                                    <CarouselPreview previews={previews} onRemoveImage={removeImage} />}
                            </div>
                        </Col>
                        <Col className={`${previews.length == 0 ? "d-none" : "col-12"}`}>
                            <div className="d-flex mt-2 flex-wrap p-3 border border-dark border-2">
                                <h3>Path:</h3>
                                <ul className="w-100 mb-0">
                                    {imagePaths.map(item => 
                                        <li>{item}</li>
                                    )}
                                </ul>
                            </div>
                        </Col>
                        <Col className={`${previews.length == 0 ? "d-none" : "col-12"}`}>
                            <div className="d-flex flex-wrap p-3 justify-content-center align-items-center">
                                <Button variant="success" onClick={startTraining}>Start Training <PlayFill /></Button>
                            </div>
                        </Col>
                    </Row>
                )
            case (TrainingMode.MODE_RESULT):
                return (
                    <Result 
                        isFinishedProcessing={isFinishedProcessing} 
                        countImage={processCount} 
                        totalImage={imagePaths.length} 
                        images={previews}
                        responses={responses}
                        elapsedSeconds={elapsedTimes}
                    />
                )
        }
    }

    return (
        render()
    )
}

export default Main