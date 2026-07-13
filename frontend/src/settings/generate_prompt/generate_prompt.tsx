import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap"
import Form from 'react-bootstrap/Form';
import { GeneratePromptOptions } from "../../constants/mode";
import { IConfigGeneratePrompt, ISettingGeneratePrompt } from "../../interfaces/config.interfaces";

function SettingGeneratePrompt(props: ISettingGeneratePrompt) {
    const [settingPrompt, setSettingPrompt] = useState<IConfigGeneratePrompt>({Mode:"", Model:"", URLLocal:"", URLCloud:"", APIKeyCloud:""})

    useEffect(() => {
        setSettingPrompt({Mode:props.data.Mode, Model:props.data.Model, URLLocal:props.data.URLLocal, URLCloud:props.data.URLCloud, APIKeyCloud:props.data.APIKeyCloud})
    }, [props])

    const handleModeGeneratePromptChange = (e:any) => {
        setSettingPrompt({
            ...settingPrompt,
            Mode: e.target.value
        })

        props.onChangeSource(e.target.value)
    }

    return(
        <Form>
            <Row className="w-full">
                <Col className="col-12">
                    <h4 className="mb-2">Generate Prompt Model Source:</h4>
                </Col>
                <Col className="col-6">
                    <Form.Check
                        type="radio"
                        label={GeneratePromptOptions.LOCAL.label}
                        name="modeGeneratePrompt"
                        id="generate-prompt-local"
                        value={GeneratePromptOptions.LOCAL.value}
                        checked={settingPrompt.Mode === GeneratePromptOptions.LOCAL.value}
                        onChange={handleModeGeneratePromptChange}
                    />
                </Col>
                <Col className="col-6">
                    <Form.Check
                        type="radio"
                        label={GeneratePromptOptions.CLOUD.label}
                        name="modeGeneratePrompt"
                        id="generate-prompt-cloud"
                        value={GeneratePromptOptions.CLOUD.value}
                        checked={settingPrompt.Mode === GeneratePromptOptions.CLOUD.value}
                        onChange={handleModeGeneratePromptChange}
                    />
                </Col>
            </Row>
        </Form>
    )
}

export default SettingGeneratePrompt