import { useEffect, useState } from 'react';
import { Button, ButtonGroup, Col, Dropdown } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { TrainingOptions } from '../../constants/mode';
import { IConfigTraining, IConfigTrainingParams } from '../../interfaces/config.interfaces';
import { Link45deg } from 'react-bootstrap-icons';

function ConfigTraining(props: IConfigTrainingParams) {
    const [trainingConfig, setTrainingConfig] = useState<IConfigTraining>({Mode:props.defaultValue.Mode, Model: props.defaultValue.Model, URLLocal:props.defaultValue.URLLocal, URLCloud:props.defaultValue.URLCloud, APIKeyCloud:props.defaultValue.APIKeyCloud})

    useEffect(() => {
        if (props.defaultValue.URLLocal != "") {
            setTrainingConfig({
                Mode: props.defaultValue.Mode,
                Model: props.defaultValue.Model,
                URLLocal: props.defaultValue.URLLocal,
                URLCloud: props.defaultValue.URLCloud,
                APIKeyCloud: props.defaultValue.APIKeyCloud
            })
        }
    }, [])

    useEffect(() => {
        props.onChangeConfig(trainingConfig)
    }, [trainingConfig])

    function handleChange(key: string, value: string) {
        if (key == "model") {
            setTrainingConfig({...trainingConfig, Model: value})
        } else if (key == "url_local") {
            setTrainingConfig({...trainingConfig, URLLocal: value})
        } else if (key == "url_cloud") {
            setTrainingConfig({...trainingConfig, URLCloud: value})
        } else if (key == "api_key") {
            setTrainingConfig({...trainingConfig, APIKeyCloud: value})
        }
    }

    return(
        <>
            <Col className="col-12 d-inline-flex">
                <Col sm={1} className="d-flex justify-content-start align-items-center">
                    <Link45deg size={45} />
                </Col>
                <Col sm={9} className="">
                    <h5 className="mt-2 text-hapax-primary">Training Model Address</h5>
                    <p className="mb-0 text-hapax-tertiary">Enter the address and the name of the model used to do the image analysis</p>
                </Col>
            </Col>
            <hr className='my-3' style={{backgroundColor:"#dbc6a7", border:"none", height:"3px"}}></hr>
            {
                props.source == TrainingOptions.LOCAL.value ? 
                <>
                    <Col className="col-12">
                        <Form.Label className='text-hapax-primary' htmlFor="training_config_local_url_label">LLM URL / IP Address</Form.Label>
                        <Form.Control
                            type="text"
                            id="training_config_local_url_form_input"
                            size={"lg"}
                            value={trainingConfig.URLLocal}
                            onChange={(e) => {handleChange("url_local", e.target.value)}}
                        />
                        <Form.Text id="training_config_local_url_form_input_info" muted>
                            Enter the URL or the IP address of the LLM running on your local machine
                        </Form.Text>
                    </Col>
                    <Col className="col-12 mt-3">
                        <div className='d-inline-flex align-items-center justify-content-center'>
                            <Form.Label className='d-inline-flex align-items-center justify-content-center me-2 mb-0 text-hapax-primary' htmlFor="training_config_local_model_label">{props.availableModels.length > 0 ? "Selected model:" : "No models available"}</Form.Label>
                            {
                                props.availableModels.length > 0 &&
                                <>
                                    <Dropdown as={ButtonGroup} drop='up-centered'>
                                        <Button className='d-inline-flex align-items-center justify-content-center btn-hapax-primary border-hapax-secondary'>{trainingConfig.Model == "" ? "Choose a model" : trainingConfig.Model}</Button>
                                        <Dropdown.Toggle split className='btn-hapax-primary border-hapax-secondary' id="dropdown-split-basic" />
                                        <Dropdown.Menu>
                                            {
                                                props.availableModels.map((item) => {
                                                    return (<Dropdown.Item onClick={(e) => handleChange("model", item)}>{item}</Dropdown.Item>)
                                                })
                                            }
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </>
                                }
                        </div>
                    </Col>
                </>
                :
                <>
                    <Col className="col-12">
                        <Form.Label className='text-hapax-primary' htmlFor="training_config_cloud_url_label">LLM URL / IP Address</Form.Label>
                        <Form.Control
                            type="text"
                            id="training_config_cloud_url_form_input"
                            size={"lg"}
                            value={trainingConfig.URLCloud}
                            onChange={(e) => {handleChange("url_cloud", e.target.value)}}
                        />
                        <Form.Text id="training_config_cloud_url_form_input_info" muted>
                            Enter the URL or the IP address of the LLM running on the cloud
                        </Form.Text>
                    </Col>
                    <Col className="col-12">
                        <Form.Label className='text-hapax-primary' htmlFor="training_config_cloud_api_key_label">LLM API Key</Form.Label>
                        <Form.Control
                            type="text"
                            id="training_config_cloud_api_key_form_input"
                            size={"lg"}
                            value={trainingConfig.APIKeyCloud}
                            onChange={(e) => {handleChange("api_key", e.target.value)}}
                        />
                        <Form.Text id="training_config_cloud_api_key_form_input_info" muted>
                            Enter your user's LLM API key
                        </Form.Text>
                    </Col>
                    <Col className="col-12">
                        <Form.Label className='text-hapax-primary' htmlFor="training_config_cloud_model_label">Model Name</Form.Label>
                        <Form.Control
                            type="text"
                            id="training_config_cloud_model_form_input"
                            size={"lg"}
                            value={trainingConfig.Model}
                            onChange={(e) => {handleChange("model", e.target.value)}}
                        />
                        <Form.Text id="training_config_cloud_model_form_input_info" muted>
                            Enter the name of the model you will be using
                        </Form.Text>
                    </Col>
                </>
            }
        </>
    )
}

export default ConfigTraining