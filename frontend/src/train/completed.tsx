import { Col } from "react-bootstrap"
import { Check } from "react-bootstrap-icons"

function Completed() {
    return (
        <Col className="col-12">
            <div className="d-flex gap-2 flex-wrap align-items-center justify-content-center p-3 border-hapax-secondary hapax-box-shadow rounded-4">
                <h1 className='d-flex align-items-center text-hapax-primary mb-0' style={{cursor:"default"}}><Check size={70} color="green" style={{marginBottom:"0"}} /> Completed!</h1>
            </div>
        </Col>
    )
}

export default Completed