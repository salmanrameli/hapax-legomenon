import { Button, Col, Row } from "react-bootstrap"
import { ITrainingResult } from "../interfaces/training.interfaces"
import Nav from 'react-bootstrap/Nav';
import { useEffect, useState } from "react";
import Spinner from 'react-bootstrap/Spinner';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { TrainingMode } from "../constants/mode";
import SelectResult from "./select_result";

function Result(props: ITrainingResult) {
    const [mode, setMode] = useState<number>(TrainingMode.MODE_HOME)
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
        setDisplayedResult(props.responses[index].text)
        setSelectedImage(index)
        setDisplayedImage(props.images[index])
        setDisplayedElapsedTime(props.elapsedSeconds[index])
    }

    useEffect(() => {
        if (props.responses.length > 0) {
            displayResult(selectedImage)
        }
    }, [])

    function handleGoBack() {
        setMode(TrainingMode.MODE_HOME)
    }

    function render() {
        switch(mode) {
            case TrainingMode.MODE_HOME: {
                return (
                    <>
                        {
                            !props.isFinishedProcessing && 
                            <Col className="col-12">
                                <div className="d-flex gap-2 flex-wrap justify-content-center p-3 border border-dark border-3">
                                    <h1><Spinner animation="border" variant="danger" style={{ width: '3rem', height: '3rem', borderWidth: '0.3em' }} /> Analyzing image{props.totalImage > 1 ? "s" : ""} in progress</h1>
                                    <div className="w-100">
                                        <ProgressBar className="w-100 rounded-0 border border-dark border-2" variant="danger" style={{ height: '20px', backgroundColor: '#000' }}  now={(props.countImage / props.totalImage) * 100} />
                                    </div>
                                </div>
                            </Col>
                        }
                        {
                            props.responses.length > 0 &&
                                <Col className="col-12 mt-2">
                                    <Nav variant="pills" defaultActiveKey={selectedImage}>
                                        {props.responses.map((_, index) => {
                                            const index_copy = index
                                            return (
                                                <Nav.Item>
                                                    <Nav.Link eventKey={index} onClick={() => displayResult(index)} >{"Image " + (index_copy + 1)}</Nav.Link>
                                                </Nav.Item>
                                            )
                                        })}
                                        {
                                            props.isFinishedProcessing &&
                                            <Nav.Item className="ml-2">
                                                <Button variant="success" onClick={props.onStartProcessingText} >Convert results to token</Button>
                                            </Nav.Item>
                                        }
                                    </Nav>
                                    <div className="d-flex mt-2 gap-2 flex-wrap justify-content-center p-3 border border-dark border-3">
                                        <img src={displayedImage} alt="Preview" className="w-100 justify-content-center d-inline-grid mb-2" style={{ maxWidth: "500px", objectFit: "cover" }} />
                                        <h5 className="w-100">Time taken to analyze: {displayedElapsedTime.toPrecision(2)} seconds</h5>
                                        <div dangerouslySetInnerHTML={{__html: displayedResult}} />
                                    </div>
                                </Col>
                        }
                    </>
                )
            }
            case TrainingMode.MODE_SELECT_RESULTS: {
                return <SelectResult goBack={handleGoBack} results={props.responses} />
            }
        }
    }

    return (
        <Row>
            {render()}
        </Row>
    )
}

export default Result