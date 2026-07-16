import { useEffect, useState } from 'react';
import { Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { GenerateImageOptions } from '../../constants/mode';
import { IConfigGenerateImage, IConfigGenerateImageParams } from '../../interfaces/config.interfaces';
import { Link45deg } from 'react-bootstrap-icons';

function ConfigImage(props: IConfigGenerateImageParams) {
    const [imageConfig, setImageConfig] = useState<IConfigGenerateImage>({Mode:props.defaultValue.Mode, Model:props.defaultValue.Model, URLLocal:props.defaultValue.URLLocal, URLCloud:props.defaultValue.URLCloud, APIKeyCloud:props.defaultValue.APIKeyCloud, Steps:props.defaultValue.Steps, Dimension:props.defaultValue.Dimension})

    useEffect(() => {
        if (props.defaultValue.URLLocal != "") {
            setImageConfig({
                Mode: props.defaultValue.Mode,
                Model: props.defaultValue.Model,
                URLLocal: props.defaultValue.URLLocal,
                URLCloud: props.defaultValue.URLCloud,
                APIKeyCloud: props.defaultValue.APIKeyCloud,
                Steps: props.defaultValue.Steps,
                Dimension: props.defaultValue.Dimension
            })
        }
    }, [])

    useEffect(() => {
        props.onChangeConfig(imageConfig)
    }, [imageConfig])

    function handleChange(key: string, value: string) {
        if (key == "model") {
            setImageConfig({...imageConfig, Model: value})
        } else if (key == "url_local") {
            setImageConfig({...imageConfig, URLLocal: value})
        } else if (key == "url_cloud") {
            setImageConfig({...imageConfig, URLCloud: value})
        } else if (key == "api_key") {
            setImageConfig({...imageConfig, APIKeyCloud: value})
        } else if (key == "steps") {
            let steps = parseInt(value)

            if (steps > 40) {
                steps = 40
            } else if (steps < 5) {
                steps = 5
            }

            setImageConfig({...imageConfig, Steps: steps})
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
                    <p className="mb-0 text-hapax-tertiary">Enter the address and the name of the model used to generate the image</p>
                </Col>
            </Col>
            <hr className='my-3' style={{backgroundColor:"#dbc6a7", border:"none", height:"3px"}}></hr>
            {
                props.source == GenerateImageOptions.LOCAL.value ? 
                <>
                    <Col className="col-12">
                        <Form.Label className='text-hapax-primary' htmlFor="image_config_local_url_label">LLM URL / IP Address</Form.Label>
                        <Form.Control
                            type="text"
                            id="image_config_local_url_form_input"
                            size={"lg"}
                            value={imageConfig.URLLocal}
                            onChange={(e) => {handleChange("url_local", e.target.value)}}
                        />
                        <Form.Text id="image_config_local_url_form_input_info" muted>
                            Enter the URL or the IP address of the LLM running on your local machine
                        </Form.Text>
                    </Col>
                    <Col className="col-12 mt-3">
                        <Form.Label className='text-hapax-primary' htmlFor="image_config_local_model_label">Model Name</Form.Label>
                        <Form.Control
                            type="text"
                            id="image_config_local_model_form_input"
                            size={"lg"}
                            value={imageConfig.Model}
                            onChange={(e) => {handleChange("model", e.target.value)}}
                        />
                        <Form.Text id="image_config_local_model_form_input_info" muted>
                            Enter the name of the model you will be using
                        </Form.Text>
                    </Col>
                </>
                :
                <>
                    <Col className="col-12">
                        <Form.Label className='text-hapax-primary' htmlFor="image_config_cloud_url_label">LLM URL / IP Address</Form.Label>
                        <Form.Control
                            type="text"
                            id="image_config_cloud_url_form_input"
                            size={"lg"}
                            value={imageConfig.URLCloud}
                            onChange={(e) => {handleChange("url_cloud", e.target.value)}}
                        />
                        <Form.Text id="image_config_cloud_url_form_input_info" muted>
                            Enter the URL or the IP address of the LLM running on the cloud
                        </Form.Text>
                    </Col>
                    <Col className="col-12 mt-3">
                        <Form.Label className='text-hapax-primary' htmlFor="image_config_cloud_api_key_label">LLM API Key</Form.Label>
                        <Form.Control
                            type="text"
                            id="image_config_cloud_api_key_form_input"
                            size={"lg"}
                            value={imageConfig.APIKeyCloud}
                            onChange={(e) => {handleChange("api_key", e.target.value)}}
                        />
                        <Form.Text id="image_config_cloud_api_key_form_input_info" muted>
                            Enter your user's LLM API key
                        </Form.Text>
                    </Col>
                    <Col className="col-12 mt-3">
                        <Form.Label className='text-hapax-primary' htmlFor="image_config_cloud_model_label">Model Name</Form.Label>
                        <Form.Control
                            type="text"
                            id="image_config_cloud_model_form_input"
                            size={"lg"}
                            value={imageConfig.Model}
                            onChange={(e) => {handleChange("model", e.target.value)}}
                        />
                        <Form.Text id="image_config_cloud_model_form_input_info" muted>
                            Enter the name of the model you will be using
                        </Form.Text>
                    </Col>
                </>
            }
            <Col className="col-12 mt-3">
                <Form.Label className='text-hapax-primary' htmlFor="image_config_steps_label">Steps</Form.Label>
                <Form.Control
                    type="number"
                    id="image_config_steps_form_input"
                    size={"lg"}
                    value={imageConfig.Steps}
                    max={40}
                    min={5}
                    onChange={(e) => {handleChange("steps", e.target.value)}}
                />
                <Form.Text id="image_config_steps_form_input_info" muted>
                    How many steps the LLM has to do during generating image (min: 5, max: 40)
                </Form.Text>
            </Col>
        </>
    )
}

export default ConfigImage