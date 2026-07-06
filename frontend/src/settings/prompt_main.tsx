import { Col, Row } from "react-bootstrap"
import SettingGeneratePrompt from "./generate_prompt";
import { useEffect, useState } from "react";
import { GetAppConfigValue } from "../../wailsjs/go/main/App"
import ConfigPrompt from "./config_prompt";

function PromptMain() {
    const [generatePromptSource, setGeneratePromptSource] = useState<string>("")

    useEffect(() => {
        GetAppConfigValue().then((value) => {
            setGeneratePromptSource(value.mode_generate_prompt)
        })
    }, [])

    const handleChangeSourcePrompt = (source: string) => {
        setGeneratePromptSource(source)
    }

    return (
        <Row>
            <Col className={"col-12"}>
                <div className="d-inline-flex w-100 flex-wrap p-3 border border-1 rounded-3 border-primary">
                    <SettingGeneratePrompt onChangeSource={handleChangeSourcePrompt} />
                </div>
                <div className="d-inline-flex w-100 mt-2 flex-wrap p-3 border border-1 rounded-3 border-primary">
                    <ConfigPrompt promptSource={generatePromptSource} />
                </div>
            </Col>
        </Row>
    )
}

export default PromptMain