import {useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { GenerateImageOptions, GeneratePromptOptions, Mode, RenderContentID, TrainingOptions } from './constants/mode';
import { CardImage, FileEarmarkArrowUp, Folder2, GearWideConnected, Magic, PlusSquare, Terminal } from 'react-bootstrap-icons';
import { Form } from 'react-bootstrap';
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
                    DimensionWidth: value.dimension_width,
                    DimensionHeight: value.dimension_height
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
                        <Col sm={12} md={12} className='d-flex mt-2'>
                            <Col sm={3}>
                                <img src={logo} className='pt-0' style={{width:"220px", height:"220px", cursor:"default", marginBottom:"-20px", marginLeft:"-20px"}} id="logo" alt="logo"/>
                            </Col>
                            <Col sm={6} className='d-flex align-items-center mt-3' style={{marginLeft:"-50px", cursor:"default"}}>
                                <div style={{marginTop:"15px"}}>
                                    <h1>Hapax Legomenon</h1>
                                    <p className='text-hapax-tertiary' style={{cursor:"default", marginTop:"-5px"}}>
                                        project: {currentProjectDetail.name}&nbsp;&nbsp;
                                    </p>
                                </div>
                            </Col>
                            <Col sm={3} className='d-flex mt-3 align-items-center justify-content-end' style={{cursor:"default"}}>
                                <div>
                                    <div className='d-flex rounded-pill bg-hapax-secondary border-hapax-secondary py-2 px-3 w-100'>
                                        {<div className={`rounded-circle ${errorPythonNotInstalled ? "bg-danger" : "bg-success"}`} style={{height:"10px", width:"10px", marginTop:"7px"}} />}&nbsp;&nbsp;Python:&nbsp;{errorPythonNotInstalled ? "not detected" : "detected"}
                                    </div>
                                    <div className='d-flex rounded-pill bg-hapax-secondary border-hapax-secondary py-2 px-3 mt-2 w-100'>
                                        {<div className={`rounded-circle ${warnOllamaNotRunning ? "bg-danger" : "bg-success"}`} style={{height:"10px", width:"10px", marginTop:"7px"}} />}&nbsp;&nbsp;Ollama:&nbsp;{warnOllamaNotRunning ? "not running" : "running"}
                                    </div>
                                </div>
                            </Col>
                        </Col>
                        <hr className='my-3' style={{backgroundColor:"#dbc6a7", border:"none", height:"3px"}}></hr>
                        <Col sm={12} md={6} className='mb-3'>
                            <div className='d-flex'>
                                <Button size='lg' onClick={handleShowProjectsList} className='btn-hapax-primary border-hapax-secondary text-center font-weight-bold rounded-4' style={{width:"100%", backgroundColor:"white"}}><Folder2 style={{marginTop:"-3px", marginRight:"10px"}} />Change Project</Button>
                            </div>
                        </Col>
                        <Col sm={12} md={6} className='mb-3'>
                            <div className='d-flex'>
                                <Button size='lg' onClick={() => setMode(Mode.MODE_SET_PROJECT_NAME)} className='btn-hapax-primary border-hapax-secondary text-center font-weight-bold rounded-4' style={{width:"100%"}}><PlusSquare style={{marginTop:"-3px", marginRight:"10px"}} />Create New Project</Button>
                            </div>
                        </Col>
                        <Col sm={12} md={6}>
                            <Button
                                size="lg" 
                                className="w-100 btn-hapax-primary border-hapax-primary px-3 py-4 rounded-4"
                                onClick={() => setMode(Mode.MODE_TRAIN)}
                                style={{height:"200px"}}
                                disabled={disableTrainingButton || errorPythonNotInstalled || (trainingConfigData?.Mode == TrainingOptions.LOCAL.value && warnOllamaNotRunning)}
                                >
                                <CardImage size={60} />
                                <br />
                                <span className='text-uppercase mb-0 fw-bold' style={{fontSize:"36px"}}>Train with Images</span>
                                <br />
                                <span style={{fontSize:"12px"}} className=''>Give images to enrich visual understandings</span>
                            </Button>
                        </Col>
                        <Col sm={12} md={6}>
                            <Button
                                size="lg"
                                className="w-100 btn-hapax-primary-dark btn-hapax-danger px-3 py-4 rounded-4"
                                onClick={() => setMode(Mode.MODE_GENERATE_PROMPT)}
                                style={{height:"200px"}}
                                disabled={disableGenerateButton || errorPythonNotInstalled || (promptModeConfigData?.Mode == GeneratePromptOptions.LOCAL.value && warnOllamaNotRunning)}
                                >
                                <Magic size={60} />
                                <br />
                                <span id="btn-generate-prompt-title" className='text-uppercase mb-0 fw-bold' style={{fontSize:"36px"}}>Generate Prompt</span>
                                <br />
                                <span style={{fontSize:"12px"}} className=''>Generate prompts and images</span>
                            </Button>
                        </Col>
                        <Col sm={12} md={4} className='mt-3'>
                            <Button 
                                onClick={() => setMode(Mode.MODE_SETTING_TRAINING)} 
                                className='d-flex btn-hapax-primary bg-hapax-soft border-hapax-secondary text-start font-weight-bold rounded-4 p-3' 
                                style={{width:"100%", fontSize:"20px", height:"120px"}}>
                                    <Col sm={2} className='d-flex align-items-center vertical-align-middle'>
                                        <GearWideConnected size={27} style={{marginTop:"0px", marginLeft:"0px"}} className='d-flex justify-content-center' />
                                    </Col>
                                    <Col sm={10}>
                                        <h5 className='mb-1'>Training Settings</h5>
                                        <p className="mb-4" style={{fontSize:"12px"}}>Configure model training parameters</p>
                                        <p className='fw-light' style={{fontSize:"12px"}}>
                                            {trainingConfigData?.Model ? "running: " + trainingConfigData.Model + " / " + trainingConfigData.Mode : "not yet set" }
                                        </p>
                                    </Col>
                            </Button>
                        </Col>
                        <Col sm={12} md={4} className='mt-3'>
                            <Button 
                                onClick={() => setMode(Mode.MODE_SETTING_PROMPT)} 
                                className='d-flex btn-hapax-primary bg-hapax-soft border-hapax-secondary text-start font-weight-bold rounded-4 p-3' 
                                style={{width:"100%", fontSize:"20px", height:"120px"}}>
                                    <Col sm={2} className='d-flex align-items-center vertical-align-middle'>
                                        <Terminal size={27} style={{marginTop:"0px", marginLeft:"0px"}} className='d-flex justify-content-center' />
                                    </Col>
                                    <Col sm={10}>
                                        <h5 className='mb-1'>Prompt Settings</h5>
                                        <p className='mb-4' style={{fontSize:"12px"}}>Configure prompt generation parameters</p>
                                        <p className='fw-light' style={{fontSize:"12px"}}>
                                            {promptModeConfigData?.Model ? "running: " + promptModeConfigData.Model + " / " + promptModeConfigData.Mode : "not yet set" }
                                        </p>
                                    </Col>
                            </Button>
                        </Col>
                        <Col sm={12} md={4} className='mt-3'>
                            <Button 
                                onClick={() => setMode(Mode.MODE_SETTING_IMAGE)} 
                                className='d-flex btn-hapax-primary bg-hapax-soft border-hapax-secondary text-start font-weight-bold rounded-4 p-3' 
                                style={{width:"100%", fontSize:"20px", height:"120px"}}>
                                    <Col sm={2} className='d-flex align-items-center vertical-align-middle'>
                                        <CardImage size={27} style={{marginTop:"0px", marginLeft:"0px"}} className='d-flex justify-content-center' />
                                    </Col>
                                    <Col sm={10}>
                                        <h5 className='mb-1'>Generate Image Settings</h5>
                                        <p className='mb-4' style={{fontSize:"12px"}}>Configure image generation parameters</p>
                                        <p className='fw-light' style={{fontSize:"12px"}}>
                                            {imageModeConfigData?.Model ? "running: " + imageModeConfigData.Model + " / " + imageModeConfigData.Mode : "not yet set" }
                                        </p>
                                    </Col>
                            </Button>
                        </Col>
                        <Col sm={12} md={12} className='mt-3' style={{cursor:"default", position:"absolute", left:"10px", bottom: "-70px", width:"200px"}}>
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
                        <img src={logo} className='pt-0' style={{width:"200px", height:"200px", cursor:"pointer"}} id="logo" alt="logo" onClick={() => setMode(Mode.MODE_LOADING)}/>
                    </Col>
                    <Col sm={12} md={12} className=''>
                    {
                        contentId == RenderContentID.MODE_CREATE_NEW &&
                            <>
                                <Form.Label className='text-hapax-primary' htmlFor="user_project_name">Project Name:</Form.Label>
                                <Form.Control
                                    type="text"
                                    id="user_project_name_form_input"
                                    size={"lg"}
                                    onChange={(e) => {setProjectName(e.target.value)}}
                                />
                                <Button size='lg' onClick={handleCreateNewProject} disabled={projectName.trim() == ""} className="mt-3 btn-hapax-primary border-hapax-primary hapax-box-shadow rounded-4 w-25">Save</Button>
                            </>
                    }
                    {
                        contentId == RenderContentID.MODE_SHOW_LIST &&
                            <>
                                <div className="overflow-auto" style={{ maxHeight: '400px' }}>
                                    <Table responsive bordered hover>
                                        <thead className="sticky-top top-0 border-hapax-secondary hapax-box-shadow rounded-4"> 
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
                                <Button size='lg' onClick={handleLoadProject} disabled={selectedProject.id == currentProjectDetail.id} className="mt-3 btn-hapax-primary border-hapax-primary hapax-box-shadow rounded-4 w-25">Load <FileEarmarkArrowUp style={{marginTop:"-3px"}} /></Button>
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
