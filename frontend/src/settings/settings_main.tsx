import { Col, Row } from "react-bootstrap"
import SettingGeneratePrompt from "./generate_prompt";

function SettingsMain() {
    return (
        <Row>
            <Col className={"col-12"}>
                <div className="d-inline-flex w-100 flex-wrap p-3 border border-1 rounded-3 border-primary">
                    <SettingGeneratePrompt />
                </div>
            </Col>
        </Row>
    )
}

export default SettingsMain