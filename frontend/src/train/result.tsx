import { Col, Row } from "react-bootstrap"
import { ITrainingResult } from "../interfaces/training.interfaces"
import Nav from 'react-bootstrap/Nav';
import { useEffect, useState } from "react";
import Spinner from 'react-bootstrap/Spinner';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { Dump } from "../../wailsjs/go/main/App";

function Result(props: ITrainingResult) {
    const [displayedResult, setDisplayedResult] = useState<string>("")
    const [selectedImage, setSelectedImage] = useState<number>(0)
    const [displayedImage, setDisplayedImage] = useState<string>("")
    const [displayedElapsedTime, setDisplayedElapsedTime] = useState<number>(0)

    useEffect(() => {
        if (props.responses.length > 0 && displayedResult == "") {
            displayResult(selectedImage)
            setDisplayedImage(props.images[0])
            setDisplayedElapsedTime(props.elapsedSeconds[0])
        }
    }, [props])

    function displayResult(index: number) {
        setDisplayedResult(props.responses[index])
        setSelectedImage(index)
        setDisplayedImage(props.images[index])
        setDisplayedElapsedTime(props.elapsedSeconds[index])
    }

    useEffect(() => {
        if (props.responses.length > 0) {
            displayResult(selectedImage)
        }
    }, [])

    return (
        <Row>
            {
                !props.isFinishedProcessing && 
                <Col className="col-12">
                    <div className="d-flex gap-2 flex-wrap justify-content-center p-3 border border-dark border-2">
                        <h1><Spinner animation="border" variant="info" /> Analyzing image{props.totalImage > 1 ? "s" : ""} in progress</h1>
                        <div className="w-100">
                            <ProgressBar className="w-100" variant="success" now={(props.countImage / props.totalImage) * 100} />
                        </div>
                    </div>
                </Col>
            }
            {
                props.responses.length > 0 &&
                    <Col className="col-12 mt-2">
                        <Nav variant="pills" defaultActiveKey={0}>
                            {props.responses.map((_, index) => {
                                return (
                                    <Nav.Item>
                                        <Nav.Link eventKey={index} onClick={() => displayResult(index)} >{"Image " + (index + 1)}</Nav.Link>
                                    </Nav.Item>
                                )
                            })}
                        </Nav>
                        <div className="d-flex mt-2 gap-2 flex-wrap justify-content-center p-3 border border-dark border-2">
                            <img src={displayedImage} alt="Preview" className="w-100 justify-content-center d-inline-grid mb-2" style={{ maxWidth: "500px", objectFit: "cover" }} />
                            <h5 className="w-100">Time taken to analyze: {displayedElapsedTime}</h5>
                            <div dangerouslySetInnerHTML={{__html: displayedResult}} />
                        </div>
                    </Col>
            }
        </Row>
    )
}

export default Result