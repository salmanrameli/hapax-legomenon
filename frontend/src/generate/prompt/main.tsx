import { useState } from "react"
import { GenerateMode } from "../../constants/mode"
import { Button, Col, Row, Spinner } from "react-bootstrap"
import { GenerateImage, GeneratePrompt, SaveImage } from "../../../wailsjs/go/main/App"
import { FileEarmarkArrowDown, FileEarmarkArrowDownFill, PlayFill } from "react-bootstrap-icons"

const BTN_PROMPT_DEFAULT_TEXT = 'Generate prompt'
const BTN_PROMPT_GENERATING_TEXT = ' Generating prompt'

const BTN_IMAGE_DEFAULT_TEXT = 'Generate image'
const BTN_IMAGE_GENERATING_TEXT = ' Generating image'

function GeneratePromptMain() {
    const [mode, setMode] = useState<number>(GenerateMode.MODE_DEFAULT)
    const [prompt, setPrompt] = useState<string>("")
    const [image, setImage] = useState<string>("")

    async function generatePrompt() {
        setMode(GenerateMode.MODE_GENERATING_PROMPT)
        setPrompt("")
        setImage("")

        GeneratePrompt().then((value) => {
            setPrompt(value)
        }).finally(() => {
            setMode(GenerateMode.MODE_DEFAULT)
        })
    }

    function generateImage() {
        if (prompt !== undefined) {
            setMode(GenerateMode.MODE_GENERATING_IMAGE)

            GenerateImage(prompt).then((value) => {
                if (value) {
                    setImage(value)
                }
            }).finally(() => {
                setMode(GenerateMode.MODE_DEFAULT)
            })
        }
    }

    function saveImage() {
        if (image !== undefined) {
            SaveImage(image, prompt).then((value) => {
                setMode(GenerateMode.MODE_DEFAULT)
            })
        }
    }

    function render() {
        return (
            <Row>
                <Col className="col-12">
                    <div className="d-flex mt-2 gap-2 flex-wrap justify-content-center p-3 border border-dark border-3">
                        <div className="d-flex" style={{height: "200px", width:"100%", overflowY:"scroll"}}>
                            <p>{prompt}</p>
                        </div>
                    </div>
                </Col>
                <Col className="col-12">
                    <div className="d-flex flex-wrap p-3 justify-content-center align-items-center">
                        <Button variant="outline-dark" size="lg" className="border border-dark border-3 rounded-0" disabled={mode == GenerateMode.MODE_GENERATING_PROMPT || mode == GenerateMode.MODE_GENERATING_IMAGE} onClick={generatePrompt}>{mode == GenerateMode.MODE_GENERATING_PROMPT ? BTN_PROMPT_GENERATING_TEXT : BTN_PROMPT_DEFAULT_TEXT} {mode == GenerateMode.MODE_GENERATING_PROMPT ? <Spinner animation="border" variant="danger" style={{ width: '1.5rem', height: '1.5rem', borderWidth: '0.3em' }} /> : <PlayFill />}</Button>
                        &nbsp;
                        <Button variant="danger" size="lg" className="border border-danger border-3 rounded-0" disabled={mode == GenerateMode.MODE_GENERATING_PROMPT || mode == GenerateMode.MODE_GENERATING_IMAGE || prompt == "" || prompt == undefined} onClick={generateImage}>{mode == GenerateMode.MODE_GENERATING_IMAGE ? BTN_IMAGE_GENERATING_TEXT : BTN_IMAGE_DEFAULT_TEXT} {mode == GenerateMode.MODE_GENERATING_IMAGE ? <Spinner animation="border" variant="light" style={{ width: '1.5rem', height: '1.5rem', borderWidth: '0.3em' }} /> : <PlayFill />}</Button>
                        &nbsp;
                        <Button variant="danger" size="lg" className="border border-danger border-3 rounded-0" disabled={image == ""} onClick={saveImage}>Save Result <FileEarmarkArrowDownFill style={{marginTop: "-3px"}} /></Button>
                    </div>
                </Col>
                {
                    image && 
                        <Col className="col-12">
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