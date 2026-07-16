import { Col } from "react-bootstrap"

function Completed() {
    return (
        <Col className="col-12">
            <div className="d-flex gap-2 flex-wrap justify-content-center p-3 border-hapax-secondary hapax-box-shadow rounded-4">
                <h1 className='text-hapax-primary' style={{cursor:"default"}}>Completed!</h1>
            </div>
        </Col>
    )
}

export default Completed