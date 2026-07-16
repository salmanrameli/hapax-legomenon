import { useEffect, useState } from "react"
import { GenerateMode } from "../../constants/mode"
import { Button, Col, Row, Spinner } from "react-bootstrap"
import { GenerateImage, GeneratePrompt, SaveImage, IsPlatformMac } from "../../../wailsjs/go/main/App"
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
    const [isPlatformMac, setIsPlatformMac] = useState<boolean>(false)

    useEffect(() => {
        IsPlatformMac().then((value: boolean) => {
            setIsPlatformMac(value)
        })
    }, [])

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
                <Col sm={12}>
                    <div className="d-flex bg-white gap-2 flex-wrap justify-content-center p-3 border-hapax-secondary hapax-box-shadow rounded-4">
                        <div className="d-flex" style={{height: "200px", width:"100%", overflowY:"scroll"}}>
                            <textarea disabled={mode == GenerateMode.MODE_GENERATING_IMAGE || mode == GenerateMode.MODE_GENERATING_PROMPT} placeholder="Type your prompt here or create one using the button below" style={{width:"100%", height:"100%", resize:"none", boxSizing:"border-box", border:"none", outline:"none"}} value={prompt} onChange={(e) => mode !== GenerateMode.MODE_GENERATING_IMAGE && setPrompt(e.target.value)} />
                        </div>
                    </div>
                </Col>
                <Col sm={12} md={4}>
                    <Button size="lg" className="w-100 mt-4 btn-hapax-primary border-hapax-primary hapax-box-shadow rounded-4" disabled={mode == GenerateMode.MODE_GENERATING_PROMPT || mode == GenerateMode.MODE_GENERATING_IMAGE} onClick={generatePrompt}>{mode == GenerateMode.MODE_GENERATING_PROMPT ? BTN_PROMPT_GENERATING_TEXT : BTN_PROMPT_DEFAULT_TEXT} {mode == GenerateMode.MODE_GENERATING_PROMPT ? <Spinner animation="border" style={{color: '#0f3159', width: '1.5rem', height: '1.5rem', borderWidth: '0.3em' }} /> : <PlayFill />}</Button>
                    <br /><br />
                    <Button size="lg" className="w-100 btn-hapax-danger rounded-4" disabled={!isPlatformMac || mode == GenerateMode.MODE_GENERATING_PROMPT || mode == GenerateMode.MODE_GENERATING_IMAGE || prompt == "" || prompt == undefined} onClick={generateImage}>{mode == GenerateMode.MODE_GENERATING_IMAGE ? BTN_IMAGE_GENERATING_TEXT : BTN_IMAGE_DEFAULT_TEXT} {mode == GenerateMode.MODE_GENERATING_IMAGE ? <Spinner animation="border" variant="danger" style={{ width: '1.5rem', height: '1.5rem', borderWidth: '0.3em' }} /> : <PlayFill />}</Button>
                    <br /><br />
                    <Button size="lg" className="w-100 btn-hapax-primary border-hapax-primary hapax-box-shadow rounded-4" disabled={image == ""} onClick={saveImage}>Save Result <FileEarmarkArrowDownFill style={{marginTop: "-3px"}} /></Button>
                </Col>
                {
                    image && 
                        <Col sm={12} md={8}>
                            <div className="bg-hapax-light border-hapax-secondary hapax-box-shadow rounded-4 mt-3">
                                {
                                    elapsedSeconds &&
                                    <div className="d-flex flex-wrap justify-content-center align-items-center mt-2">
                                        <b className="mb-0 text-hapax-primary">Generate time: {elapsedSeconds.toPrecision(4)} seconds</b>
                                    </div>
                                }
                                <div className="d-flex flex-wrap pt-2 pb-4 justify-content-center align-items-center">
                                    <img src={"data:image/png;base64," + image} alt="Preview" className="w-100 justify-content-center d-inline-grid" style={{ maxWidth:"300px", maxHeight:"300px", objectFit: "cover" }} />
                                </div>
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