import {useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { GenerateImageOptions, GeneratePromptOptions, Mode, TrainingOptions } from './constants/mode';
import { GearWideConnected, HouseFill } from 'react-bootstrap-icons';
import { Card } from 'react-bootstrap';
import GeneratePromptMain from './generate/prompt/main';
import TrainingSettingMain from './settings/training/train_main';
import PromptSettingMain from './settings/generate_prompt/prompt_main';
import ImageSettingMain from './settings/generate_image/image_main';
import TrainingMain from './train/main';
import { Dump, GetAvailableLocalModels, GetGenerateImageConfigValue, GetGeneratePromptConfigValue, GetTrainingConfigValue } from '../wailsjs/go/main/App';
import { IConfigGenerateImage, IConfigGeneratePrompt, IConfigTraining } from './interfaces/config.interfaces';

function App() {
    const [mode, setMode] = useState<number>(Mode.MODE_HOME)
    const [trainingConfigData, setTrainingConfigData] = useState<IConfigTraining>()
    const [promptModeConfigData, setPromptModeConfigData] = useState<IConfigGeneratePrompt>()
    const [imageModeConfigData, setImageConfigData] = useState<IConfigGenerateImage>()
    const [disableTrainingButton, setDisableTrainingButton] = useState<boolean>(true)
    const [disableGenerateButton, setDisableGenerateButton] = useState<boolean>(true)
    // const [availableModels, setAvailableModels] = useState<IAvailableModelList>()

    useEffect(() => {
        loadData()
    }, [])

    function loadData() {
        // GetAvailableLocalModels().then((value) => {
        //     setAvailableModels(value)
        // })

        GetTrainingConfigValue().then((value) => {
            if (value) {
                setTrainingConfigData({
                    Mode: value.mode,
                    Model: value.model,
                    URLLocal: value.url_local,
                    URLCloud: value.url_cloud,
                    APIKeyCloud: value.api_key_cloud
                })

                if (value.model == "") setDisableTrainingButton(true)
                else if (value.mode == TrainingOptions.LOCAL.value && value.url_local == "") setDisableTrainingButton(true)
                else if (value.mode == TrainingOptions.CLOUD.value && (value.url_cloud == "" || value.api_key_cloud == "")) setDisableTrainingButton(true)
                else setDisableTrainingButton(false)
            }
        })

        GetGeneratePromptConfigValue().then((value) => {
            if (value) {
                setPromptModeConfigData({
                    Mode: value.mode,
                    Model: value.model,
                    URLLocal: value.url_local,
                    URLCloud: value.url_cloud,
                    APIKeyCloud: value.api_key_cloud
                })
            }
        })

        GetGenerateImageConfigValue().then((value) => {
            if (value) {
                setImageConfigData({
                    Mode: value.mode,
                    Model: value.model,
                    URLLocal: value.url_local,
                    URLCloud: value.url_cloud,
                    APIKeyCloud: value.api_key_cloud
                })
            }
        })
    }

    useEffect(() => {
        if (promptModeConfigData?.Model == "" || imageModeConfigData?.Model == "") setDisableGenerateButton(true)
        else if ((promptModeConfigData?.Mode == GeneratePromptOptions.LOCAL.value && promptModeConfigData.URLLocal == "") || (imageModeConfigData?.Mode == GenerateImageOptions.LOCAL.value && imageModeConfigData.URLLocal == "")) setDisableGenerateButton(true)
        else if ((promptModeConfigData?.Mode == GeneratePromptOptions.CLOUD.value && promptModeConfigData.URLCloud == "") || (imageModeConfigData?.Mode == GenerateImageOptions.CLOUD.value && (imageModeConfigData.URLCloud == "" || imageModeConfigData.APIKeyCloud == ""))) setDisableGenerateButton(true)
        else setDisableGenerateButton(false)
    }, [promptModeConfigData, imageModeConfigData])

    function handleHomeButtonClicked() {
        loadData()

        setMode(Mode.MODE_HOME)
    }

    function show() {
        switch(mode) {
            case Mode.MODE_HOME:
                return (
                    <Row className="g-0 mb-4">
                        <Col md={6} className='border border-dark border-3'>
                            <Card className="rounded-0 bg-white text-dark h-100 border-0">
                                <Card.Body className="d-flex align-items-center justify-content-center p-5">
                                    <Button
                                        variant="outline-dark" 
                                        size="lg" 
                                        className="rounded-0 fw-bold text-uppercase px-5 py-4 fs-3 border-3"
                                        onClick={() => setMode(Mode.MODE_TRAIN)}
                                        disabled={disableTrainingButton}
                                        >
                                        Train with Images <br /><span className={trainingConfigData?.Model == "" ? "d-none" : ""} style={{fontSize:"12px", marginTop:"-10px"}}>Model: {trainingConfigData?.Model}</span>
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6}>
                            <Card className="rounded-0 bg-dark text-white h-100">
                                <Card.Body className="d-flex align-items-center justify-content-center p-5">
                                    <Button
                                        variant="danger" 
                                        size="lg" 
                                        className="rounded-0 fw-bold text-uppercase px-5 py-4 fs-3"
                                        style={{ backgroundColor: '#E32636', borderColor: '#E32636' }}
                                        onClick={() => setMode(Mode.MODE_GENERATE_PROMPT)}
                                        disabled={disableGenerateButton}
                                        >
                                        Generate Prompt 
                                        <br /><span className={promptModeConfigData?.Model == "" ? "d-none" : ""} style={{fontSize:"12px", marginTop:"-10px"}}>Prompt: {promptModeConfigData?.Model}</span>
                                        <span className={imageModeConfigData?.Model == "" ? "d-none" : ""} style={{fontSize:"12px", marginTop:"-10px"}}><span className={imageModeConfigData?.Model == "" ? "d-none" : ""}> | </span>Image: {imageModeConfigData?.Model}</span>
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col className='col-12 mt-3'>
                            <div className='d-flex border border-dark border-3'>
                                <Button variant='outline-dark' onClick={() => setMode(Mode.MODE_SETTING_TRAINING)} className='text-start font-weight-bold' style={{width:"100%", border:"none", borderRadius:"0px", fontSize:"20px"}}><GearWideConnected style={{marginTop:"-3px"}} /> Configure Training Settings <span style={{float:"right"}}>running: {trainingConfigData?.Mode}</span></Button>
                            </div>
                        </Col>
                        <Col className='col-12 mt-3'>
                            <div className='d-flex border border-dark border-3'>
                                <Button variant='outline-dark' onClick={() => setMode(Mode.MODE_SETTING_PROMPT)} className='text-start font-weight-bold' style={{width:"100%", border:"none", borderRadius:"0px", fontSize:"20px"}}><GearWideConnected style={{marginTop:"-3px"}} /> Configure Prompt Settings <span style={{float:"right"}}>running: {promptModeConfigData?.Mode}</span></Button>
                            </div>
                        </Col>
                        <Col className='col-12 mt-3'>
                            <div className='d-flex border border-dark border-3'>
                                <Button variant='outline-dark' onClick={() => setMode(Mode.MODE_SETTING_IMAGE)} className='text-start font-weight-bold' style={{width:"100%", border:"none", borderRadius:"0px", fontSize:"20px"}}><GearWideConnected style={{marginTop:"-3px"}} /> Configure Generate Image Settings <span style={{float:"right"}}>running: {imageModeConfigData?.Mode}</span></Button>
                            </div>
                        </Col>
                    </Row>
                )
            case Mode.MODE_TRAIN:
                return (<TrainingMain />)
            case Mode.MODE_GENERATE_PROMPT:
                return (<GeneratePromptMain />)
            case Mode.MODE_SETTING_TRAINING:
                return (<TrainingSettingMain />)
            case Mode.MODE_SETTING_PROMPT:
                return (<PromptSettingMain />)
            case Mode.MODE_SETTING_IMAGE:
                return (<ImageSettingMain />)
        }
    }

    return (
        <Container fluid id="App" className="pb-4">
            <Row>
                <Col className='d-inline-flex' style={{cursor:"default"}}>{mode == Mode.MODE_HOME ? '' : <div className="d-inline-flex align-items-center me-2" onClick={handleHomeButtonClicked}><HouseFill size={25} /></div>}<h1 className="my-2">Ubiquitous-Funicular</h1></Col>
            </Row>
            {show()}
        </Container>        
    )
}

export default App
