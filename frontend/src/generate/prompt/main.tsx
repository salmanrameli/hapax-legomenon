import { useState } from "react"
import { GenerateMode } from "../../constants/mode"
import { Button, Col, Row, Spinner } from "react-bootstrap"
import { GenerateImage, GeneratePrompt, SaveImage } from "../../../wailsjs/go/main/App"
import { FileEarmarkArrowDownFill, PlayFill } from "react-bootstrap-icons"

const BTN_PROMPT_DEFAULT_TEXT = 'Generate prompt'
const BTN_PROMPT_GENERATING_TEXT = ' Generating prompt'

const BTN_IMAGE_DEFAULT_TEXT = 'Generate image'
const BTN_IMAGE_GENERATING_TEXT = ' Generating image'

interface IGeneratePromptMain {
    projectId: string
    projectName: string
}

function GeneratePromptMain(props: IGeneratePromptMain) {
    const [mode, setMode] = useState<number>(GenerateMode.MODE_DEFAULT)
    const [prompt, setPrompt] = useState<string>("")
    const [image, setImage] = useState<string>("")
    const [elapsedSeconds, setElapsedSeconds] = useState<number>(0)

    async function generatePrompt() {
        setMode(GenerateMode.MODE_GENERATING_PROMPT)
        setPrompt("")
        setImage("")
        setElapsedSeconds(0)

        GeneratePrompt(props.projectId).then((value) => {
            setPrompt(value)
        }).finally(() => {
            setMode(GenerateMode.MODE_DEFAULT)
        })
    }

    function generateImage() {
        if (prompt !== undefined) {
            setElapsedSeconds(0)
            setMode(GenerateMode.MODE_GENERATING_IMAGE)

            const start = performance.now();

            GenerateImage(props.projectId, prompt).then((value) => {
                if (value) {
                    setImage(value)
                }
            }).finally(() => {
                setMode(GenerateMode.MODE_DEFAULT)

                const end = performance.now();

                const timeTaken = (end - start) / 1000;

                setElapsedSeconds(timeTaken)
            })
        }
    }

    function saveImage() {
        if (image !== undefined) {
            SaveImage(image, prompt, props.projectName).then((value) => {
                setMode(GenerateMode.MODE_DEFAULT)
            })
        }
    }

    function render() {
        return (
            <Row>
                <Col className="col-12">
                    <div className="d-flex gap-2 flex-wrap justify-content-center p-3 border border-dark border-3">
                        <div className="d-flex" style={{height: "200px", width:"100%", overflowY:"scroll"}}>
                            <p>{prompt}</p>
                        </div>
                    </div>
                </Col>
                <Col className="col-12">
                    <div className="d-flex flex-wrap p-3 justify-content-center align-items-center">
                        <Button variant="outline-dark" size="lg" className="border border-dark border-3 rounded-0" disabled={mode == GenerateMode.MODE_GENERATING_PROMPT || mode == GenerateMode.MODE_GENERATING_IMAGE} onClick={generatePrompt}>{mode == GenerateMode.MODE_GENERATING_PROMPT ? BTN_PROMPT_GENERATING_TEXT : BTN_PROMPT_DEFAULT_TEXT} {mode == GenerateMode.MODE_GENERATING_PROMPT ? <Spinner animation="border" variant="danger" style={{ width: '1.5rem', height: '1.5rem', borderWidth: '0.3em' }} /> : <PlayFill />}</Button>
                        &nbsp;
                        <Button variant={mode == GenerateMode.MODE_GENERATING_IMAGE ? "outline-danger" : "danger"} size="lg" className="border border-danger border-3 rounded-0" disabled={mode == GenerateMode.MODE_GENERATING_PROMPT || mode == GenerateMode.MODE_GENERATING_IMAGE || prompt == "" || prompt == undefined} onClick={generateImage}>{mode == GenerateMode.MODE_GENERATING_IMAGE ? BTN_IMAGE_GENERATING_TEXT : BTN_IMAGE_DEFAULT_TEXT} {mode == GenerateMode.MODE_GENERATING_IMAGE ? <Spinner animation="border" variant="danger" style={{ width: '1.5rem', height: '1.5rem', borderWidth: '0.3em' }} /> : <PlayFill />}</Button>
                        &nbsp;
                        <Button variant="outline-success" size="lg" className="border border-success border-3 rounded-0" disabled={image == ""} onClick={saveImage}>Save Result <FileEarmarkArrowDownFill style={{marginTop: "-3px"}} /></Button>
                    </div>
                </Col>
                {
                    image && 
                        <Col className="col-12">
                            {
                                elapsedSeconds &&
                                <div className="d-flex flex-wrap justify-content-center align-items-center">
                                    <p className="mb-0">generate time: {elapsedSeconds.toPrecision(4)} seconds</p>
                                </div>
                            }
                            <div className="d-flex flex-wrap p-3 justify-content-center align-items-center">
                                <img src={"data:image/png;base64," + image} alt="Preview" className="w-100 justify-content-center d-inline-grid" style={{ maxWidth: "300px", objectFit: "cover" }} />
                            </div>
                        </Col>
                }
            </Row>
        )
    }

    return (
        render()
    )
}

export default GeneratePromptMain