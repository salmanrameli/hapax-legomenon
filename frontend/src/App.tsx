import {useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { GenerateImageOptions, GeneratePromptOptions, Mode, RenderContentID, TrainingOptions } from './constants/mode';
import { FileEarmarkArrowUp, FileEarmarkPlus, GearWideConnected, ListTask } from 'react-bootstrap-icons';
import { Alert, Card, Form } from 'react-bootstrap';
import GeneratePromptMain from './generate/prompt/main';
import TrainingSettingMain from './settings/training/train_main';
import PromptSettingMain from './settings/generate_prompt/prompt_main';
import ImageSettingMain from './settings/generate_image/image_main';
import TrainingMain from './train/main';
import { CheckIfOllamaIsRunning, CheckIfPythonIsInstalled, Dump, GetAvailableLocalModels, GetGenerateImageConfigValue, GetGeneratePromptConfigValue, GetTrainingConfigValue, CheckAppConfig, GetCurrentProjectDetail, HandleCreateNewProject, GetUserProjectsList, SetSelectedProject } from '../wailsjs/go/main/App';
import { IConfigGenerateImage, IConfigGeneratePrompt, IConfigTraining, ICurrentProjectDetail } from './interfaces/config.interfaces';
import logo from './assets/images/appicon.png';
import Table from 'react-bootstrap/Table';
import './App.css'
import { APPVERSION } from './constants/appversion';

function App() {
    const [mode, setMode] = useState<number>(-1)
    const [trainingConfigData, setTrainingConfigData] = useState<IConfigTraining>()
    const [promptModeConfigData, setPromptModeConfigData] = useState<IConfigGeneratePrompt>()
    const [imageModeConfigData, setImageConfigData] = useState<IConfigGenerateImage>()
    const [disableTrainingButton, setDisableTrainingButton] = useState<boolean>(true)
    const [disableGenerateButton, setDisableGenerateButton] = useState<boolean>(true)
    const [errorPythonNotInstalled, setErrorPythonNotInstalled] = useState<boolean>(false)
    const [warnOllamaNotRunning, setWarnOllamaNotRunning] = useState<boolean>(false)
    const [animateLoading, setAnimateLoading] = useState<boolean>(false)
    const [animateHomepage, setAnimateHomepage] = useState<boolean>(false)
    const [showPage, setShowPage] = useState<boolean>(false)
    const [showLoading, setShowLoading] = useState<boolean | undefined>(undefined)
    const [projectName, setProjectName] = useState<string>("")
    const [currentProjectDetail, setCurrentProjectDetail] = useState<ICurrentProjectDetail>({id: "", name: ""})
    const [selectedProject, setSelectedProject] = useState<ICurrentProjectDetail>({id:"", name:""})
    const [availableProjects, setAvailableProjects] = useState<ICurrentProjectDetail[]>()
    // const [availableModels, setAvailableModels] = useState<IAvailableModelList>()

    useEffect(() => {
        setShowLoading(true)
        setMode(Mode.MODE_LOADING)
    }, [])

    function CheckCurrentProjectDetail() {
        GetCurrentProjectDetail().then((value: ICurrentProjectDetail) => {
            setTimeout(() => {
                if (value.name == "") {
                    setMode(Mode.MODE_SET_PROJECT_NAME)
                } else {
                    // setAnimateHomepage(true)
                    // setShowLoading(false)
                    setMode(Mode.MODE_HOME)
                }
            }, 700)
            
        })
    }

    useEffect(() => {
        switch(mode) {
            case Mode.MODE_LOADING:
                setShowLoading(true)
                setAnimateLoading(true)
                CheckAppConfig().then(() => {
                    CheckCurrentProjectDetail()
                })
                break;
            case Mode.MODE_HOME:
                // setShowLoading(false)
                setAnimateHomepage(true)
                GetCurrentProjectDetail().then((value: ICurrentProjectDetail) => {
                    setCurrentProjectDetail({
                        id: value.id,
                        name: value.name
                    })
                })
                // loadData()
                break;
            case Mode.MODE_SET_PROJECT_NAME:
                break;
        }
    }, [mode])

    useEffect(() => {
        if (currentProjectDetail?.id && currentProjectDetail.name)
            loadData()
    }, [currentProjectDetail])

    function loadData() {
        // GetAvailableLocalModels().then((value) => {
        //     setAvailableModels(value)
        // })

        CheckIfPythonIsInstalled().then((value: boolean) => {
            if (!value) {
                setErrorPythonNotInstalled(true)
            }
        })

        CheckIfOllamaIsRunning(currentProjectDetail.id).then((value: boolean) => {
            if (!value) {
                setWarnOllamaNotRunning(true)
            }
        })

        GetTrainingConfigValue(currentProjectDetail.id).then((value) => {
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

        GetGeneratePromptConfigValue(currentProjectDetail.id).then((value) => {
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

        GetGenerateImageConfigValue(currentProjectDetail.id).then((value) => {
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

        GetUserProjectsList().then((value: any) => {
            if (value) {
                setAvailableProjects(value)
            }
        })

        setSelectedProject(currentProjectDetail)
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

    function handleCreateNewProject() {
        HandleCreateNewProject(projectName, true).then(() => {
            setMode(Mode.MODE_HOME)
        })
    }

    function handleShowProjectsList() {
        setMode(Mode.MODE_SHOW_PROJECTS_LIST)
    }

    function showHomeContent() {
        switch(mode) {
            case Mode.MODE_HOME:
                return (
                    <Row className="gx-2 mb-4">
                        <Col sm={12} md={12} className='d-flex align-items-center justify-content-center'>
                            <img src={logo} className='pt-0' style={{width:"200px", height:"200px", cursor:"default", marginBottom:"-20px"}} id="logo" alt="logo"/>
                        </Col>
                        {errorPythonNotInstalled && 
                            <Col sm={12}>
                                <Alert key="danger" variant="danger" style={{cursor:"default"}} className='mt-2'>
                                    Application is unable to detect Python3 — application will not work!
                                </Alert>
                            </Col>
                        }
                        {warnOllamaNotRunning && 
                            <Col sm={12}>
                                <Alert key="warning" variant="warning" style={{cursor:"default"}} className={errorPythonNotInstalled ? '' : "mt-2"}>
                                    Ollama is not running — features might be limited
                                </Alert>
                            </Col>
                        }
                        <Col sm={12} className='' style={{cursor:"default"}}>
                            <p className='text-uppercase'>
                                <b>Project: {currentProjectDetail.name}</b>&nbsp;&nbsp;
                            </p>
                        </Col>
                        <Col sm={12} md={6} className='mb-3'>
                            <div className='d-flex border-hapax-primary'>
                                <Button variant='outline-dark' onClick={handleShowProjectsList} className='btn-hapax-secondary text-start font-weight-bold' style={{width:"100%", border:"none", borderRadius:"0px"}}>Change Project <ListTask style={{marginTop:"-3px"}} /></Button>
                            </div>
                        </Col>
                        <Col sm={12} md={6} className='mb-3'>
                            <div className='d-flex border border-dark border-3'>
                                <Button variant='outline-dark' onClick={() => setMode(Mode.MODE_SET_PROJECT_NAME)} className='btn-hapax-secondary text-start font-weight-bold' style={{width:"100%", border:"none", borderRadius:"0px"}}>Create New Project <FileEarmarkPlus style={{marginTop:"-3px"}} /></Button>
                            </div>
                        </Col>
                        <Col sm={12} md={6} className='border gx-0 border-dark border-end-0 border-3'>
                            <Card className="rounded-0 bg-white text-dark h-100 border-0">
                                <Card.Body className="d-flex align-items-center justify-content-center p-5">
                                    <Button
                                        size="lg" 
                                        className="btn-hapax-primary border border-dark border-4 rounded-0 fw-bold text-uppercase px-5 py-4 fs-3"
                                        onClick={() => setMode(Mode.MODE_TRAIN)}
                                        disabled={disableTrainingButton || errorPythonNotInstalled || (trainingConfigData?.Mode == TrainingOptions.LOCAL.value && warnOllamaNotRunning)}
                                        >
                                        Train with Images
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col sm={12} md={6} className='gx-0'>
                            <Card className="rounded-0 text-white h-100" id='bg-generate-prompt'>
                                <Card.Body className="d-flex align-items-center justify-content-center p-5">
                                    <Button
                                        id='generate-prompt'
                                        size="lg" 
                                        className="rounded-0 fw-bold text-uppercase w-100 py-4 fs-3"
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
                                <Button onClick={() => setMode(Mode.MODE_SETTING_TRAINING)} className='btn-hapax-secondary text-start font-weight-bold' style={{width:"100%", border:"none", borderRadius:"0px", fontSize:"20px"}}><GearWideConnected style={{marginTop:"-3px"}} /> Training Settings <br /><br /><span className='fw-light' style={{fontSize:"12px"}}>{trainingConfigData?.Model ? "running: " + trainingConfigData.Model + " / " + trainingConfigData.Mode : "not yet set" }</span></Button>
                            </div>
                        </Col>
                        <Col sm={12} md={4} className='mt-3'>
                            <div className='d-flex border border-dark border-3' style={{height:"120px"}}>
                                <Button  onClick={() => setMode(Mode.MODE_SETTING_PROMPT)} className='btn-hapax-secondary text-start font-weight-bold' style={{width:"100%", border:"none", borderRadius:"0px", fontSize:"20px"}}><GearWideConnected style={{marginTop:"-3px"}} /> Prompt Settings <br /><br /><span className='fw-light' style={{fontSize:"12px"}}>{promptModeConfigData?.Model ? "running: " + promptModeConfigData.Model + " / " + promptModeConfigData.Mode : "not yet set" }</span></Button>
                            </div>
                        </Col>
                        <Col sm={12} md={4} className='mt-3'>
                            <div className='d-flex border border-dark border-3' style={{height:"120px"}}>
                                <Button onClick={() => setMode(Mode.MODE_SETTING_IMAGE)} className='btn-hapax-secondary text-start font-weight-bold' style={{width:"100%", border:"none", borderRadius:"0px", fontSize:"20px"}}><GearWideConnected style={{marginTop:"-3px"}} /> Generate Image Settings <br /><br /><span className='fw-light' style={{fontSize:"12px"}}>{imageModeConfigData?.Model ? "running: " + imageModeConfigData.Model + " / " + imageModeConfigData.Mode : "not yet set" }</span></Button>
                            </div>
                        </Col>
                        <Col sm={12} md={12} className='mt-1'>
                            <small>version: {APPVERSION}</small>
                        </Col>
                    </Row>
                )
            case Mode.MODE_TRAIN:
                return (<TrainingMain projectId={currentProjectDetail.id} />)
            case Mode.MODE_GENERATE_PROMPT:
                return (<GeneratePromptMain projectId={currentProjectDetail.id} projectName={currentProjectDetail.name} />)
            case Mode.MODE_SETTING_TRAINING:
                return (<TrainingSettingMain projectId={currentProjectDetail.id} />)
            case Mode.MODE_SETTING_PROMPT:
                return (<PromptSettingMain projectId={currentProjectDetail.id} />)
            case Mode.MODE_SETTING_IMAGE:
                return (<ImageSettingMain projectId={currentProjectDetail.id} />)
        }
    }

    function renderLoading() {
        return (
            <Container fluid id="App" className={`${animateLoading ? "wails-fade-in" : "wails-fade-out"} pb-4 mb-4`} style={{height:"100vh"}}>
                <Row className={`d-flex w-100 h-100`}>
                    <Col sm={12} md={12} className='d-flex align-items-center justify-content-center'>
                        <img src={logo} className='pt-0' style={{width:"400px", height:"400px", cursor:"default"}} id="logo" alt="logo"/>
                    </Col>
                    <Col sm={12} md={12} className='d-flex align-items-center justify-content-center'>
                        <small>v{APPVERSION}</small>
                    </Col>
                </Row>    
            </Container>
        )
    }

    function handleLoadProject() {
        SetSelectedProject(selectedProject.id).then(() => {
                setCurrentProjectDetail({
                id: selectedProject.id,
                name: selectedProject.name
            })
        }).then(() => setMode(Mode.MODE_LOADING))
    }

    function renderProjectDetail(contentId: number) {
        return (
            <Container fluid id="App" className={`${animateLoading ? "wails-fade-out" : "wails-fade-in"} d-flex align-items-center justify-content-center pb-4 mb-4`} style={{height:"90vh"}}>
                <Row className={`gx-2 mb-4 w-100`}>
                    <Col sm={12} md={12} className='d-flex align-items-center justify-content-center'>
                        <img src={logo} className='pt-0' style={{width:"200px", height:"200px", cursor:"default"}} id="logo" alt="logo" onClick={() => setMode(Mode.MODE_LOADING)}/>
                    </Col>
                    <Col sm={12} md={12} className=''>
                    {
                        contentId == RenderContentID.MODE_CREATE_NEW &&
                            <>
                                <Form.Label htmlFor="user_project_name">Project Name:</Form.Label>
                                <Form.Control
                                    type="text"
                                    id="user_project_name_form_input"
                                    size={"lg"}
                                    onChange={(e) => {setProjectName(e.target.value)}}
                                />
                                <Button size='lg' onClick={handleCreateNewProject} disabled={projectName == ""} className="btn-hapax-primary border border-dark border-2 mt-2 rounded-0">Save</Button>
                            </>
                    }
                    {
                        contentId == RenderContentID.MODE_SHOW_LIST &&
                            <>
                                <div className="overflow-auto" style={{ maxHeight: '400px' }}>
                                    <Table responsive bordered hover>
                                        <thead className="table-light sticky-top top-0"> 
                                            <tr>
                                                <th style={{cursor:"default"}}>Available Projects</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                availableProjects?.map((item) => {
                                                    return (
                                                         <tr className={selectedProject.id == item.id ? 'table-success' : ''} style={{cursor:"pointer"}} id={item.id} onClick={_ => setSelectedProject({id: item.id, name: item.name})}>
                                                            <td>{item.name}{currentProjectDetail.id == item.id && currentProjectDetail.id !== selectedProject.id ? " (current)" : ''}</td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </Table>
                                </div>
                                <Button size='lg' onClick={handleLoadProject} disabled={selectedProject.id == currentProjectDetail.id} className="mt-2 btn-hapax-primary border border-dark border-2 rounded-0">Load <FileEarmarkArrowUp style={{marginTop:"-3px"}} /></Button>
                            </>
                    }
                    </Col>
                </Row>    
            </Container>
        )
    }

    function render() {
        switch(mode) {
            case Mode.MODE_LOADING:
                return renderLoading()
            case Mode.MODE_SET_PROJECT_NAME:
                return renderProjectDetail(RenderContentID.MODE_CREATE_NEW)
            case Mode.MODE_SHOW_PROJECTS_LIST:
                return renderProjectDetail(RenderContentID.MODE_SHOW_LIST)
            default:
                return (
                    <Container fluid id="App" className={`${animateHomepage ? 'wails-fade-in' : ''} pb-4 mb-4 bg-hapax-light`} style={{height:"90vh"}}>
                        <Row className="gx-2 mb-2">
                            <Col className='d-inline-flex' style={{cursor:"default"}}>
                                {mode == Mode.MODE_HOME ? 
                                    '' : 
                                    <div className="d-inline-flex mt-4 align-items-center" onClick={handleHomeButtonClicked}>
                                        <img src={logo} className='mt-2' style={{width:"70px", height:"70px", cursor:"pointer"}} id="logo" alt="logo"/>
                                    </div>}
                            </Col>
                        </Row>
                        {showHomeContent()}
                    </Container>
                )
        }
    }

    return (
        render()
    )
}

export default App
