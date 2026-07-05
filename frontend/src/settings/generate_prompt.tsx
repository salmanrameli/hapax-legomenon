import { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap"
import Form from 'react-bootstrap/Form';
import { GeneratePromptOptions } from "../constants/mode";
import { GetGeneratePromptConfigValue, StoreGeneratePromptConfig } from "../../wailsjs/go/main/App"

interface IAppConfig {
    ModeGeneratePrompt: string,
    ModeGenerateImage: string
}

function SettingGeneratePrompt() {
    const [settingPrompt, setSettingPrompt] = useState<IAppConfig>({ModeGeneratePrompt:"", ModeGenerateImage:""})
    const [settingPromptDefault, setSettingPromptDefault] = useState<IAppConfig>({ModeGeneratePrompt:"", ModeGenerateImage:""})

    useEffect(() => {
        GetGeneratePromptConfigValue().then((value) => {
            setSettingPrompt({ModeGeneratePrompt: value.mode_generate_prompt, ModeGenerateImage: value.mode_generate_image})
            setSettingPromptDefault({ModeGeneratePrompt: value.mode_generate_prompt, ModeGenerateImage: value.mode_generate_image})
        })
    }, [])

    const handleModeGeneratePromptChange = (e:any) => {
        setSettingPrompt({ModeGeneratePrompt:e.target.value, ModeGenerateImage:settingPrompt.ModeGenerateImage})
    }

    function handleSaveModeGeneratePrompt() {
        StoreGeneratePromptConfig({
            mode_generate_prompt: settingPrompt.ModeGeneratePrompt,
            mode_generate_image: settingPrompt.ModeGenerateImage
        }).then(() => {
            // setModeDefaultGeneratePrompt(modeGeneratePrompt)

            setSettingPromptDefault({ModeGeneratePrompt: settingPrompt.ModeGeneratePrompt, ModeGenerateImage: settingPrompt.ModeGenerateImage})
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
                        checked={settingPrompt.ModeGeneratePrompt === GeneratePromptOptions.LOCAL.value}
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
                        checked={settingPrompt.ModeGeneratePrompt === GeneratePromptOptions.CLOUD.value}
                        onChange={handleModeGeneratePromptChange}
                    />
                </Col>
                <Col className="col-12">
                    <Button variant="success" disabled={settingPrompt.ModeGeneratePrompt == settingPromptDefault.ModeGeneratePrompt} onClick={handleSaveModeGeneratePrompt} className="mt-2">Save</Button>
                </Col>
            </Row>
        </Form>
    )
}

export default SettingGeneratePrompt