import {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { global } from './constants/constants';
import Main from './train/main';
import { HouseFill } from 'react-bootstrap-icons';

function App() {
    const [mode, setMode] = useState<number>(global.MODE_HOME)

    function show() {
        switch(mode) {
            case global.MODE_HOME:
                return (
                    <Row className="justify-content-center align-items-center vh-100">
                        <Col className="text-center">
                            <Button variant="outline-primary" size="lg" onClick={() => setMode(global.MODE_TRAIN)}>Train with Images</Button>
                        </Col>
                        <Col className='text-center'>
                            <Button variant="outline-primary" size="lg" onClick={() => setMode(global.MODE_GENERATE_PROMPT)}>Generate Prompt</Button>
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
                <Col className='d-inline-flex'>{mode == global.MODE_HOME ? '' : <div className="d-inline-flex align-items-center me-2" onClick={_ => {setMode(global.MODE_HOME)}}><HouseFill /></div>}<h1 className="my-2">Ubiquitous-Funicular</h1></Col>
            </Row>
            {show()}
        </Container>        
    )
}

export default App
