import { Col, Row } from "react-bootstrap"
import { ITrainingResult } from "../interfaces/training.interfaces"

function Result(props: ITrainingResult) {
    return (
        <Row>
            <Col className="col-12">
                <div className="d-flex mt-2 gap-2 flex-wrap justify-content-center rounded-5 p-3 border border-1 border-primary">
                    <h1>Result</h1>
                    <p dangerouslySetInnerHTML={{__html: props.response}} />
                </div>
            </Col>
        </Row>
    )
}

export default Result