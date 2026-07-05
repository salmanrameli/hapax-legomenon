import { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap"
import Form from 'react-bootstrap/Form';
import { GeneratePromptOptions } from "../constants/mode";
import { GetGeneratePromptConfigValue, StoreGeneratePromptConfig } from "../../wailsjs/go/main/App"

function SettingGeneratePrompt() {
    const [modeGeneratePrompt, setModeGeneratePrompt] = useState<string>("")
    const [modeDefaultGeneratePrompt, setModeDefaultGeneratePrompt] = useState<string>("")
    const [modeGenerateImage, setModeGenerateImage] = useState<string>("")
    const [modeDefaultGenerateImage, setModeDefaultGenerateImage] = useState<string>("")

    useEffect(() => {
        GetGeneratePromptConfigValue().then((value) => {
            setModeGeneratePrompt(value.mode_generate_prompt)
            setModeDefaultGeneratePrompt(value.mode_generate_prompt)
            setModeGenerateImage(value.mode_generate_image)
        })
    }, [])

    const handleModeGeneratePromptChange = (e:any) => {
        setModeGeneratePrompt(e.target.value)
    }

    function handleSaveModeGeneratePrompt() {
        StoreGeneratePromptConfig(modeGeneratePrompt, modeGenerateImage).then(() => {
            setModeDefaultGeneratePrompt(modeGeneratePrompt)
        })
    }

    function handleSaveModeGenerateImage() {

    }

    return(
        <Form>
            <Row className="w-full">
                <Col className="col-12">
                    <h4 className="mb-2">Generate Prompt Model Source:</h4>
                </Col>
                <Col className="col-3">
                    <Form.Check
                        type="radio"
                        label={GeneratePromptOptions.LOCAL.label}
                        name="modeGeneratePrompt"
                        id="generate-prompt-local"
                        value={GeneratePromptOptions.LOCAL.value}
                        checked={modeGeneratePrompt === GeneratePromptOptions.LOCAL.value}
                        onChange={handleModeGeneratePromptChange}
                    />
                </Col>
                <Col className="col-3">
                    <Form.Check
                        type="radio"
                        label={GeneratePromptOptions.CLOUD.label}
                        name="modeGeneratePrompt"
                        id="generate-prompt-cloud"
                        value={GeneratePromptOptions.CLOUD.value}
                        checked={modeGeneratePrompt === GeneratePromptOptions.CLOUD.value}
                        onChange={handleModeGeneratePromptChange}
                    />
                </Col>
                <Col className="col-12">
                    <Button variant="success" disabled={modeGeneratePrompt == modeDefaultGeneratePrompt} onClick={handleSaveModeGeneratePrompt} className="mt-2">Save</Button>
                </Col>
            </Row>
        </Form>
    )
}

export default SettingGeneratePrompt