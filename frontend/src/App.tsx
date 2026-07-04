import {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { global } from './constants/constants';
import Main from './train/main';
import { GearWideConnected, HouseFill } from 'react-bootstrap-icons';

function App() {
    const [mode, setMode] = useState<number>(global.MODE_HOME)

    function show() {
        switch(mode) {
            case global.MODE_HOME:
                return (
                    <Row>
                        <Col className="col-12 col-md-6 text-center" style={{height:"300px"}}>
                            <div className='d-flex h-100 justify-content-center align-items-center border rounded-3'>
                                <Button variant="outline-primary" size="lg" onClick={() => setMode(global.MODE_TRAIN)}>Train with Images</Button>
                            </div>
                        </Col>
                        <Col className='col-12 col-md-6 text-center' style={{height:"300px"}}>
                            <div className='d-flex h-100 justify-content-center align-items-center border rounded-3'>
                                <Button variant="outline-primary" size="lg" onClick={() => setMode(global.MODE_GENERATE_PROMPT)}>Generate Prompt</Button>
                            </div>
                        </Col>
                        <Col className='col-12 mt-3'>
                            <div className='d-flex border rounded-3 p-2'>
                                <h5 className='mb-0'><GearWideConnected style={{marginTop:"-3px"}} /> Configure Settings</h5>
                            </div>
                        </Col>
                    </Row>
                )
            case global.MODE_TRAIN:
                return (<Main />)
            case global.MODE_GENERATE_PROMPT:
                return (<></>)
        }
    }

    return (
        <Container fluid id="App">
            <Row>
                <Col className='d-inline-flex'>{mode == global.MODE_HOME ? '' : <div className="d-inline-flex align-items-center me-2" onClick={_ => {setMode(global.MODE_HOME)}}><HouseFill size={25} /></div>}<h1 className="my-2">Ubiquitous-Funicular</h1></Col>
            </Row>
            {show()}
        </Container>        
    )
}

export default App
