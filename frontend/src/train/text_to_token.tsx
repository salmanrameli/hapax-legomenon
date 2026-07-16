import { Col, ProgressBar, Spinner } from "react-bootstrap"
import { ITextToToken } from "../interfaces/training.interfaces"

function TextToToken(props: ITextToToken) {
    return (
        <Col className="col-12">
            <div className="d-flex gap-2 flex-wrap justify-content-center p-3 border-hapax-secondary hapax-box-shadow rounded-4">
                <h1><Spinner animation="border" className="spinner-orange" style={{ width: '3rem', height: '3rem', borderWidth: '0.3em' }} /> Transforming text{props.totalTexts > 1 ? "s" : ""} to tokens</h1>
                <div className="w-100">
                    <ProgressBar animated className="w-100 rounded-0 border-hapax-secondary rounded-4" variant="warning" style={{ height: '20px', backgroundColor: '#fff' }} now={(props.countProcessedTexts / props.totalTexts) * 100} />
                </div>
            </div>
        </Col>
    )
}

export default TextToToken