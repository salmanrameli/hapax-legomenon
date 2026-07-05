import {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Mode } from './constants/mode';
import Main from './train/main';
import { GearWideConnected, HouseFill } from 'react-bootstrap-icons';
import SettingsMain from './settings/settings_main';

function App() {
    const [mode, setMode] = useState<number>(Mode.MODE_HOME)

    function show() {
        switch(mode) {
            case Mode.MODE_HOME:
                return (
                    <Row>
                        <Col className="col-12 col-md-6 text-center" style={{height:"300px"}}>
                            <div className='d-flex h-100 justify-content-center align-items-center border rounded-3'>
                                <Button variant="outline-primary" size="lg" onClick={() => setMode(Mode.MODE_TRAIN)}>Train with Images</Button>
                            </div>
                        </Col>
                        <Col className='col-12 col-md-6 text-center' style={{height:"300px"}}>
                            <div className='d-flex h-100 justify-content-center align-items-center border rounded-3'>
                                <Button variant="outline-primary" size="lg" onClick={() => setMode(Mode.MODE_GENERATE_PROMPT)}>Generate Prompt</Button>
                            </div>
                        </Col>
                        <Col className='col-12 mt-3'>
                            <div className='d-flex border rounded-3 p-3'>
                                <h5 role='button' className='mb-0' onClick={() => setMode(Mode.MODE_SETTING)}><GearWideConnected style={{marginTop:"-3px"}} /> Settings</h5>
                            </div>
                        </Col>
                    </Row>
                )
            case Mode.MODE_TRAIN:
                return (<Main />)
            case Mode.MODE_GENERATE_PROMPT:
                return (<></>)
            case Mode.MODE_SETTING:
                return (<SettingsMain />)
        }
    }

    return (
        <Container fluid id="App">
            <Row>
                <Col className='d-inline-flex' style={{cursor:"default"}}>{mode == Mode.MODE_HOME ? '' : <div className="d-inline-flex align-items-center me-2" onClick={_ => {setMode(Mode.MODE_HOME)}}><HouseFill size={25} /></div>}<h1 className="my-2">Ubiquitous-Funicular</h1></Col>
            </Row>
            {show()}
        </Container>        
    )
}

export default App
