import { Col, ProgressBar, Spinner } from "react-bootstrap"
import { ITextToToken } from "../interfaces/training.interfaces"

function TextToToken(props: ITextToToken) {
    return (
        <Col className="col-12">
            <div className="d-flex gap-2 flex-wrap justify-content-center p-3 border border-dark border-2">
                <h1><Spinner animation="border" variant="info" /> Transforming text{props.totalTexts > 1 ? "s" : ""} to tokens</h1>
                <div className="w-100">
                    <ProgressBar className="w-100" variant="success" now={(props.countProcessedTexts / props.totalTexts) * 100} />
                </div>
            </div>
        </Col>
    )
}

export default TextToToken