import { useState } from "react"
import { SelectImages, EncodeImagesFromPath, StartImageTraining, Dump, DescriptionsToTokens, GetCustomPOV } from "../../wailsjs/go/main/App"
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CarouselPreview from "./carousel_preview";
import { Folder2Open, PlayFill, Search } from "react-bootstrap-icons";
import { TrainingMode, XENO_INDEX } from "../constants/mode";
import Result from "./result";
import { IImageAnalysisResponse } from "../interfaces/training.interfaces";
import TextToToken from "./text_to_token";
import Completed from "./completed";
import { Form } from "react-bootstrap";

interface ITrainingMain {
    projectId: string
}

function TrainingMain(props: ITrainingMain) {
    const [imagePaths, setImagePaths] = useState<string[]>([])
    const [previews, setPreviews] = useState<string[]>([])
    const [mode, setMode] = useState<number>(TrainingMode.MODE_HOME)
    const [responses, setResponses] = useState<IImageAnalysisResponse[]>([])
    const [isFinishedProcessing, setIsFinishedProcessing] = useState<boolean>(false)
    const [processCount, setProcessCount] = useState<number>(0)
    const [elapsedTimes, setElapsedTimes] = useState<number[]>([])
    const [countProcessedText, setCountProcessedText] = useState<number>(0)
    const [generateRandomPOV, setGenerateRandomPOV] = useState<boolean>(false)
    const [xenoIndex, setXenoIndex] = useState<number>(XENO_INDEX[0].value)
    const [customPOV, setCustomPOV] = useState<string>("")

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

    async function getRandomPOV () {
        setMode(TrainingMode.MODE_RESULT)

        if (generateRandomPOV) {
            await GetCustomPOV(props.projectId, xenoIndex).then((result: string) => {
                if (result) {
                    setCustomPOV(result)
                    startTraining(result)
                }
            })
        } else {
            startTraining("")
        }
    }

    async function startTraining(pov: string) {
        let countProcessedImages = 0
        let countIndex = 0

        for (const item of imagePaths) {
            const start = performance.now();

            await StartImageTraining(props.projectId, item, pov).then((value: string) => {
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

    async function handleProcessTexts() {
        setMode(TrainingMode.MODE_PROCESSING_TEXTS_TO_TOKENS)
        
        let progress = 0;

        for (const item of responses) {            
            await DescriptionsToTokens(props.projectId, item.text).then((value) => {
                setCountProcessedText(++progress)
            })
        }
        
        setMode(TrainingMode.MODE_FINISHED)
    }

    function handleChangeUseRandomPOV() {
        setGenerateRandomPOV(!generateRandomPOV)

        if (!generateRandomPOV)
            setXenoIndex(XENO_INDEX[0].value)
    }

    function render() {
        switch(mode) {
            case (TrainingMode.MODE_HOME):
                return (
                    <Row>
                        <Col className="col-12">
                            <div className="d-flex gap-2 bg-white flex-wrap justify-content-center p-3 border-hapax-secondary hapax-box-shadow rounded-4">
                                {previews.length == 0 ?
                                    <div className="d-flex justify-content-center align-items-center" style={{height: "400px", width:"100%"}}>
                                        <Button size="lg" className="d-flex align-items-center justify-content-center rounded-0 btn-hapax-primary border-hapax-primary hapax-box-shadow rounded-4" onClick={_ => handleOpenFileDialog()} ><Folder2Open size={35} className="me-3" /> Import Images (max. 5)</Button>
                                    </div>
                                    : 
                                    <CarouselPreview previews={previews} onRemoveImage={removeImage} />}
                            </div>
                        </Col>
                        <Col className={`${previews.length == 0 ? "d-none" : "col-12"}`}>
                            <div className="d-flex mt-3 flex-wrap p-3 border-hapax-secondary hapax-box-shadow rounded-4">
                                <h3>Path:</h3>
                                <ul className="w-100 mb-0">
                                    {imagePaths.map(item => 
                                        <li>{item}</li>
                                    )}
                                </ul>
                            </div>
                        </Col>
                        <Col className={`${previews.length == 0 ? "d-none" : "col-12"}`}>
                            <div className="d-flex mt-3 flex-wrap p-3 border-hapax-secondary hapax-box-shadow rounded-4">
                                <Col sm={12}>
                                        <Form.Check 
                                        className="my-2"
                                        type="checkbox"
                                        id="generate-random-pov"
                                        label="Use randomly generated POV from database"
                                        checked={generateRandomPOV}
                                        onChange={_ => handleChangeUseRandomPOV()}
                                    />
                                </Col>
                                <Col sm={4}>
                                    <Form.Check
                                        className=""
                                        type="radio"
                                        label={XENO_INDEX[0].label}
                                        name="xenoIndexLight"
                                        id="xeno-light"
                                        value={XENO_INDEX[0].value}
                                        checked={xenoIndex == XENO_INDEX[0].value}
                                        disabled={!generateRandomPOV}
                                        onChange={() => {setXenoIndex(XENO_INDEX[0].value)}}
                                    />
                                </Col>
                                <Col sm={4}>
                                    <Form.Check
                                        className=""
                                        type="radio"
                                        label={XENO_INDEX[1].label}
                                        name="xenoIndexMedium"
                                        id="xeno-medium"
                                        value={XENO_INDEX[1].value}
                                        checked={xenoIndex == XENO_INDEX[1].value}
                                        disabled={!generateRandomPOV}
                                        onChange={() => {setXenoIndex(XENO_INDEX[1].value)}}
                                    />
                                </Col>
                                <Col sm={4}>
                                    <Form.Check
                                        className=""
                                        type="radio"
                                        label={XENO_INDEX[2].label}
                                        name="xenoIndexHeavy"
                                        id="xeno-heavy"
                                        value={XENO_INDEX[2].value}
                                        checked={xenoIndex == XENO_INDEX[2].value}
                                        disabled={!generateRandomPOV}
                                        onChange={() => {setXenoIndex(XENO_INDEX[2].value)}}
                                    />
                                </Col>
                            </div>
                            <div className="d-flex flex-wrap justify-content-center align-items-center">
                                <Button size="lg" className="btn-hapax-primary my-4 border-hapax-primary hapax-box-shadow rounded-4" onClick={() => {getRandomPOV()}}><Search className="me-2" style={{marginTop:"-4px"}} /> Analyze Image{imagePaths.length > 1 ? "s" : ""}</Button>
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
                        onStartProcessingText={handleProcessTexts}
                        customPOV={customPOV}
                    />
                )
            case TrainingMode.MODE_PROCESSING_TEXTS_TO_TOKENS:
                return (<TextToToken countProcessedTexts={countProcessedText} totalTexts={responses.length} />)
            case TrainingMode.MODE_FINISHED:
                return (<Completed />)
        }
    }

    return (
        render()
    )
}

export default TrainingMain