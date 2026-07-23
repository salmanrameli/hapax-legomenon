import { Button, Col, Row } from "react-bootstrap"
import { ITrainingResult } from "../interfaces/training.interfaces"
import { useEffect, useState } from "react";
import Spinner from 'react-bootstrap/Spinner';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { TrainingMode } from "../constants/mode";
import SelectResult from "./select_result";
import { PlayFill } from "react-bootstrap-icons";

function Result(props: ITrainingResult) {
    const [mode, setMode] = useState<number>(TrainingMode.MODE_HOME)
    const [displayedResult, setDisplayedResult] = useState<string>("")
    const [selectedImage, setSelectedImage] = useState<number>(0)
    const [displayedImage, setDisplayedImage] = useState<string>("")
    const [displayedElapsedTime, setDisplayedElapsedTime] = useState<number>(0)
    const [selectedIndex, setSelectedIndex] = useState<number>(0)

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
        setSelectedIndex(index)
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
                                <div className="d-flex gap-2 mb-2 flex-wrap justify-content-center p-3 border-hapax-secondary hapax-box-shadow rounded-4">
                                    <h1 className="d-inline-flex text-hapax-primary"><Spinner animation="grow" className="spinner-orange me-3" style={{width: '3rem', height: '3rem', borderWidth: '0.3em', cursor:"default"}} /> Analyzing image{props.totalImage > 1 ? "s" : ""} in progress</h1>
                                    { props.customPOV ? <h6 className="text-hapax-primary">POV: {props.customPOV}</h6> : <></> }
                                    <div className="w-100">
                                        <ProgressBar animated className="w-100 rounded-0 border-hapax-secondary rounded-4" variant="warning" style={{ height: '20px', backgroundColor: '#fff' }} now={(props.countImage / props.totalImage) * 100} />
                                    </div>
                                </div>
                            </Col>
                        }
                        {
                            props.responses.length > 0 &&
                                <Col className="col-12 mb-4 d-flex flex-wrap w-100 justify-content-center align-items-center">
                                    <div className="w-100">
                                        {props.responses.map((_, index) => {
                                            const index_copy = index
                                            return (
                                                <Button className="me-2 btn-hapax-primary border-hapax-primary hapax-box-shadow rounded-4" active={selectedIndex == index} onClick={() => displayResult(index)} >{"Image " + (index_copy + 1)}</Button>
                                            )
                                        })}
                                        {props.isFinishedProcessing && <Button className="btn-hapax-danger hapax-box-shadow rounded-4 float-end" onClick={props.onStartProcessingText} >Convert result{props.totalImage > 1 ? "s" : ""} to token <PlayFill style={{marginTop:"-2px"}} size={20} /></Button>}
                                    </div>
                                    <div className="d-flex bg-white mt-2 mb-2 gap-2 flex-wrap justify-content-center p-3 border-hapax-secondary hapax-box-shadow rounded-4" style={{width:"fit-content"}}>
                                        <img src={displayedImage} alt="Preview" className="w-100 justify-content-center d-inline-grid mb-2" style={{ maxWidth: "500px", objectFit: "cover" }} />
                                    </div>
                                    <div className="d-flex w-100 bg-white mt-2 mb-2 gap-2 flex-wrap justify-content-center p-3 border-hapax-secondary hapax-box-shadow rounded-4" style={{cursor:"default"}}>
                                        <p className="w-100 mb-0"><b>Done in:</b> {displayedElapsedTime.toPrecision(4)} seconds</p>
                                        { props.customPOV ? <p className="w-100 mt-2 mb-0"><b>POV:</b> {props.customPOV}</p> : <></>}
                                    </div>
                                    <div className="d-flex w-100 bg-white mt-2 mb-2 gap-2 flex-wrap justify-content-center p-3 border-hapax-secondary hapax-box-shadow rounded-4">
                                        <div className="w-100" dangerouslySetInnerHTML={{__html: displayedResult}} />
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