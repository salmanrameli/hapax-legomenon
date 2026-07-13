import {useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { GenerateImageOptions, GeneratePromptOptions, Mode, TrainingOptions } from './constants/mode';
import { GearWideConnected, HouseFill } from 'react-bootstrap-icons';
import { Alert, Card } from 'react-bootstrap';
import GeneratePromptMain from './generate/prompt/main';
import TrainingSettingMain from './settings/training/train_main';
import PromptSettingMain from './settings/generate_prompt/prompt_main';
import ImageSettingMain from './settings/generate_image/image_main';
import TrainingMain from './train/main';
import { CheckIfOllamaIsRunning, CheckIfPythonIsInstalled, Dump, GetAvailableLocalModels, GetGenerateImageConfigValue, GetGeneratePromptConfigValue, GetTrainingConfigValue } from '../wailsjs/go/main/App';
import { IConfigGenerateImage, IConfigGeneratePrompt, IConfigTraining } from './interfaces/config.interfaces';
import logo from './assets/images/appicon.png';

function App() {
    const [mode, setMode] = useState<number>(Mode.MODE_HOME)
    const [trainingConfigData, setTrainingConfigData] = useState<IConfigTraining>()
    const [promptModeConfigData, setPromptModeConfigData] = useState<IConfigGeneratePrompt>()
    const [imageModeConfigData, setImageConfigData] = useState<IConfigGenerateImage>()
    const [disableTrainingButton, setDisableTrainingButton] = useState<boolean>(true)
    const [disableGenerateButton, setDisableGenerateButton] = useState<boolean>(true)
    const [errorPythonNotInstalled, setErrorPythonNotInstalled] = useState<boolean>(false)
    const [warnOllamaNotRunning, setWarnOllamaNotRunning] = useState<boolean>(false)
    // const [availableModels, setAvailableModels] = useState<IAvailableModelList>()

    useEffect(() => {
        loadData()
    }, [])

    function loadData() {
        // GetAvailableLocalModels().then((value) => {
        //     setAvailableModels(value)
        // })

        CheckIfPythonIsInstalled().then((value: boolean) => {
            if (!value) {
                setErrorPythonNotInstalled(true)
            }
        })

        CheckIfOllamaIsRunning().then((value: boolean) => {
            if (!value) {
                setWarnOllamaNotRunning(true)
            }
        })

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
                    APIKeyCloud: value.api_key_cloud,
                    Steps: value.steps,
                    Dimension: value.dimension
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
                    <Row className="gx-2 mb-4">
                        <Col sm={12} md={12} className='d-flex align-items-center justify-content-center'>
                            <img src={logo} style={{width:"200px", height:"200px", cursor:"default"}} id="logo" alt="logo"/>
                        </Col>
                        {errorPythonNotInstalled && 
                            <Col sm={12}>
                                <Alert key="danger" variant="danger" style={{cursor:"default"}}>
                                    Application is unable to detect Python3 — application will not work!
                                </Alert>
                            </Col>
                        }
                        {warnOllamaNotRunning && 
                            <Col sm={12}>
                                <Alert key="warning" variant="warning" style={{cursor:"default"}}>
                                    Ollama is not running — features might be limited
                                </Alert>
                            </Col>
                        }
                        <Col sm={12} md={6} className='border gx-0 border-dark border-3'>
                            <Card className="rounded-0 bg-white text-dark h-100 border-0">
                                <Card.Body className="d-flex align-items-center justify-content-center p-5">
                                    <Button
                                        variant="outline-dark" 
                                        size="lg" 
                                        className="rounded-0 fw-bold text-uppercase px-5 py-4 fs-3 border-3"
                                        onClick={() => setMode(Mode.MODE_TRAIN)}
                                        disabled={disableTrainingButton || errorPythonNotInstalled || (trainingConfigData?.Mode == TrainingOptions.LOCAL.value && warnOllamaNotRunning)}
                                        >
                                        Train with Images
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col sm={12} md={6} className='gx-0'>
                            <Card className="rounded-0 bg-dark text-white h-100">
                                <Card.Body className="d-flex align-items-center justify-content-center p-5">
                                    <Button
                                        variant="danger" 
                                        size="lg" 
                                        className="rounded-0 fw-bold text-uppercase w-100 py-4 fs-3"
                                        style={{ backgroundColor: '#E32636', borderColor: '#E32636' }}
                                        onClick={() => setMode(Mode.MODE_GENERATE_PROMPT)}
                                        disabled={disableGenerateButton || errorPythonNotInstalled || (promptModeConfigData?.Mode == GeneratePromptOptions.LOCAL.value && warnOllamaNotRunning)}
                                        >
                                        Generate Prompt 
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col sm={12} md={4} className='mt-3'>
                            <div className='d-flex border border-dark border-3' style={{height:"120px"}}>
                                <Button variant='outline-dark' onClick={() => setMode(Mode.MODE_SETTING_TRAINING)} className='text-start font-weight-bold' style={{width:"100%", border:"none", borderRadius:"0px", fontSize:"20px"}}><GearWideConnected style={{marginTop:"-3px"}} /> Training Settings <br /><br /><span className='fw-light' style={{fontSize:"12px"}}>{trainingConfigData?.Model ? "running: " + trainingConfigData.Model + " / " + trainingConfigData.Mode : "not yet set" }</span></Button>
                            </div>
                        </Col>
                        <Col sm={12} md={4} className='mt-3'>
                            <div className='d-flex border border-dark border-3' style={{height:"120px"}}>
                                <Button variant='outline-dark' onClick={() => setMode(Mode.MODE_SETTING_PROMPT)} className='text-start font-weight-bold' style={{width:"100%", border:"none", borderRadius:"0px", fontSize:"20px"}}><GearWideConnected style={{marginTop:"-3px"}} /> Prompt Settings <br /><br /><span className='fw-light' style={{fontSize:"12px"}}>{promptModeConfigData?.Model ? "running: " + promptModeConfigData.Model + " / " + promptModeConfigData.Mode : "not yet set" }</span></Button>
                            </div>
                        </Col>
                        <Col sm={12} md={4} className='mt-3'>
                            <div className='d-flex border border-dark border-3' style={{height:"120px"}}>
                                <Button variant='outline-dark' onClick={() => setMode(Mode.MODE_SETTING_IMAGE)} className='text-start font-weight-bold' style={{width:"100%", border:"none", borderRadius:"0px", fontSize:"20px"}}><GearWideConnected style={{marginTop:"-3px"}} /> Generate Image Settings <br /><br /><span className='fw-light' style={{fontSize:"12px"}}>{imageModeConfigData?.Model ? "running: " + imageModeConfigData.Model + " / " + imageModeConfigData.Mode : "not yet set" }</span></Button>
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
        <Container fluid id="App" className="pb-4 mb-4" style={{height:"100vh"}}>
            <Row>
                <Col className='d-inline-flex' style={{cursor:"default"}}>
                    {mode == Mode.MODE_HOME ? 
                        '' : 
                        <div className="d-inline-flex mt-4 mb-2 align-items-center" onClick={handleHomeButtonClicked}>
                            <img src={logo} className='mt-2' style={{width:"70px", height:"70px", cursor:"pointer"}} id="logo" alt="logo"/>
                        </div>}
                </Col>
            </Row>
            {show()}
        </Container>        
    )
}

export default App
