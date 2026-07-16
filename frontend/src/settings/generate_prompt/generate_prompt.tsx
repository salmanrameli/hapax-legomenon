import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap"
import Form from 'react-bootstrap/Form';
import { GeneratePromptOptions } from "../../constants/mode";
import { IConfigGeneratePrompt, ISettingGeneratePrompt } from "../../interfaces/config.interfaces";
import { HddStack } from "react-bootstrap-icons";

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
        <Row className="w-100">
            <Col className="col-12 d-inline-flex">
                <Col sm={1} className="d-flex justify-content-start align-items-center">
                    <HddStack size={45} />
                </Col>
                <Col sm={6} className="">
                    <h5 className="mt-2 text-hapax-primary">Prompt Model Source</h5>
                    <p className="mb-0 text-hapax-tertiary">Choose where your model to generate prompt is hosted.</p>
                </Col>
                <Col sm={5} className="d-flex justify-content-start align-items-center">
                    <div className="d-inline-flex align-items-center">
                        <Form.Check
                            className="ms-3"
                            type="radio"
                            label={GeneratePromptOptions.LOCAL.label}
                            name="modeGenerateImage"
                            id="generate-image-local"
                            value={GeneratePromptOptions.LOCAL.value}
                            checked={settingPrompt.Mode === GeneratePromptOptions.LOCAL.value}
                            onChange={handleModeGeneratePromptChange}
                        />
                        <Form.Check
                            className="ms-5"
                            type="radio"
                            label={GeneratePromptOptions.CLOUD.label}
                            name="modeGenerateImage"
                            id="generate-image-cloud"
                            value={GeneratePromptOptions.CLOUD.value}
                            disabled={true}
                            checked={settingPrompt.Mode === GeneratePromptOptions.CLOUD.value}
                            onChange={handleModeGeneratePromptChange}
                        />
                    </div>
                </Col>
            </Col>
        </Row>
    )
}

export default SettingGeneratePrompt