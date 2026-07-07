import { useEffect, useState } from 'react';
import { Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { TrainingOptions } from '../constants/mode';
import { IConfigTraining, IConfigTrainingParams } from '../interfaces/config.interfaces';

function ConfigTraining(props: IConfigTrainingParams) {
    const [trainingConfig, setTrainingConfig] = useState<IConfigTraining>({Mode:props.defaultValue.Mode, URLLocal:props.defaultValue.URLLocal, URLCloud:"", APIKeyCloud:""})

    useEffect(() => {
        if (props.defaultValue.URLLocal != "") {
            setTrainingConfig({
                Mode: props.defaultValue.Mode,
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
        if (key == "url_local") {
            setTrainingConfig({...trainingConfig, URLLocal: value})
        } else if (key == "url_cloud") {
            setTrainingConfig({...trainingConfig, URLCloud: value})
        } else if (key == "api_key") {
            setTrainingConfig({...trainingConfig, APIKeyCloud: value})
        }
    }

    return(
        <>
            <Col className="col-12">
                <h4 className="mb-2">Training Model Address:</h4>
            </Col>
            {
                props.source == TrainingOptions.LOCAL.value ? 
                <>
                    <Col className="col-12">
                        <Form.Label htmlFor="training_config_local_url_label">LLM URL / IP Address</Form.Label>
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
                </>
                :
                <>
                    <Col className="col-12">
                        <Form.Label htmlFor="training_config_cloud_url_label">LLM URL / IP Address</Form.Label>
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
                        <Form.Label htmlFor="training_config_cloud_api_key_label">LLM API Key</Form.Label>
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
                </>
            }
        </>
    )
}

export default ConfigTraining