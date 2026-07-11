import { useState } from "react"
import { PromptMode } from "../../constants/mode"
import { Button, Col, Row, Spinner } from "react-bootstrap"
import { GeneratePrompt } from "../../../wailsjs/go/main/App"
import { PlayFill } from "react-bootstrap-icons"

const BTN_DEFAULT_TEXT = 'Generate Prompt'
const BTN_GENERATING_TEXT = ' Generating prompt'

function GeneratePromptMain() {
    const [mode, setMode] = useState<number>(PromptMode.MODE_HOME)
    const [prompt, setPrompt] = useState<string>("hello world!")
    const [disableButton, setDisableButton] = useState<boolean>(false)

    async function generatePrompt() {
        setDisableButton(true)
        setPrompt("")

        GeneratePrompt().then((value) => {
            setPrompt(value)
        }).finally(() => {
            setDisableButton(false)
        })
    }

    function render() {
        switch(mode) {
            case PromptMode.MODE_HOME:
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
                                <Button variant="outline-dark" size="lg" className="border border-dark border-3 rounded-0" disabled={disableButton} onClick={generatePrompt}>{disableButton ? <Spinner animation="border" variant="danger" style={{ width: '1.5rem', height: '1.5rem', borderWidth: '0.3em' }} /> : ""}{disableButton ? BTN_GENERATING_TEXT : BTN_DEFAULT_TEXT}{disableButton ? "" : <PlayFill />}</Button>
                            </div>
                        </Col>
                    </Row>
                )
        }
    }

    return (
        render()
    )
}

export default GeneratePromptMain