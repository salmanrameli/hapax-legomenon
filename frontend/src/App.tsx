import {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Mode } from './constants/mode';
import { GearWideConnected, HouseFill } from 'react-bootstrap-icons';
import PromptMain from './settings/generate_prompt/prompt_main';
import ImageMain from './settings/generate_image/image_main';
import TrainingMain from './settings/training/train_main';
import Main from './train/main';
import { Card } from 'react-bootstrap';
import GeneratePromptMain from './generate/prompt/main';

function App() {
    const [mode, setMode] = useState<number>(Mode.MODE_HOME)

    function show() {
        switch(mode) {
            case Mode.MODE_HOME:
                return (
                    <Row className="g-0 mb-4 border-dark border-3">
                        <Col md={6}>
                            <Card className="rounded-0 bg-white text-dark h-100 border-0">
                                <Card.Body className="d-flex align-items-center justify-content-center p-5">
                                    <Button
                                        variant="outline-dark" 
                                        size="lg" 
                                        className="rounded-0 fw-bold text-uppercase px-5 py-4 fs-3 border-3"
                                        onClick={() => setMode(Mode.MODE_TRAIN)}
                                        >
                                        Train with Images
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6}>
                            <Card className="rounded-0 bg-dark text-white h-100 border-0 border-end border-dark border-3">
                                <Card.Body className="d-flex align-items-center justify-content-center p-5">
                                    <Button
                                        variant="danger" 
                                        size="lg" 
                                        className="rounded-0 fw-bold text-uppercase px-5 py-4 fs-3"
                                        style={{ backgroundColor: '#E32636', borderColor: '#E32636' }}
                                        onClick={() => setMode(Mode.MODE_GENERATE_PROMPT)}
                                        >
                                        Generate Prompt
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col className='col-12 mt-3'>
                            <div className='d-flex border border-dark border-2 p-3'>
                                <h5 role='button' className='mb-0' onClick={() => setMode(Mode.MODE_SETTING_TRAINING)}><GearWideConnected style={{marginTop:"-3px"}} /> Configure Image Training Setting</h5>
                            </div>
                        </Col>
                        <Col className='col-12 mt-3'>
                            <div className='d-flex border border-dark border-2 p-3'>
                                <h5 role='button' className='mb-0' onClick={() => setMode(Mode.MODE_SETTING_PROMPT)}><GearWideConnected style={{marginTop:"-3px"}} /> Configure Prompt Generation Setting</h5>
                            </div>
                        </Col>
                        <Col className='col-12 mt-3'>
                            <div className='d-flex border border-dark border-2 p-3'>
                                <h5 role='button' className='mb-0' onClick={() => setMode(Mode.MODE_SETTING_IMAGE)}><GearWideConnected style={{marginTop:"-3px"}} /> Configure Image Generation Setting</h5>
                            </div>
                        </Col>
                    </Row>
                )
            case Mode.MODE_GENERATE_PROMPT:
                return (<GeneratePromptMain />)
            case Mode.MODE_TRAIN:
                return (<Main />)
            case Mode.MODE_SETTING_TRAINING:
                return (<TrainingMain />)
            case Mode.MODE_SETTING_PROMPT:
                return (<PromptMain />)
            case Mode.MODE_SETTING_IMAGE:
                return (<ImageMain />)
        }
    }

    return (
        <Container fluid id="App" className="pb-4">
            <Row>
                <Col className='d-inline-flex' style={{cursor:"default"}}>{mode == Mode.MODE_HOME ? '' : <div className="d-inline-flex align-items-center me-2" onClick={_ => {setMode(Mode.MODE_HOME)}}><HouseFill size={25} /></div>}<h1 className="my-2">Ubiquitous-Funicular</h1></Col>
            </Row>
            {show()}
        </Container>        
    )
}

export default App
