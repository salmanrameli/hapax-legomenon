import { useEffect, useState } from 'react';
import { Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { GenerateImageOptions } from '../constants/mode';
import { IConfigGenerateImage, IConfigGenerateImageParams } from '../interfaces/config.interfaces';

function ConfigImage(props: IConfigGenerateImageParams) {
    const [imageConfig, setImageConfig] = useState<IConfigGenerateImage>({Mode:props.defaultValue.Mode, URLLocal:props.defaultValue.URLLocal, URLCloud:"", APIKeyCloud:""})

    useEffect(() => {
        if (props.defaultValue.URLLocal != "") {
            setImageConfig({
                Mode: props.defaultValue.Mode,
                URLLocal: props.defaultValue.URLLocal,
                URLCloud: props.defaultValue.URLCloud,
                APIKeyCloud: props.defaultValue.APIKeyCloud
            })
        }
    }, [])

    useEffect(() => {
        props.onChangeConfig(imageConfig)
    }, [imageConfig])

    function handleChange(key: string, value: string) {
        if (key == "url_local") {
            setImageConfig({...imageConfig, URLLocal: value})
        } else if (key == "url_cloud") {
            setImageConfig({...imageConfig, URLCloud: value})
        } else if (key == "api_key") {
            setImageConfig({...imageConfig, APIKeyCloud: value})
        }
    }

    return(
        <>
            <Col className="col-12">
                <h4 className="mb-2">Generate Image Model Address:</h4>
            </Col>
            {
                props.source == GenerateImageOptions.LOCAL.value ? 
                <>
                    <Col className="col-12">
                        <Form.Label htmlFor="image_config_local_url_label">LLM URL / IP Address</Form.Label>
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
                </>
                :
                <>
                    <Col className="col-12">
                        <Form.Label htmlFor="image_config_cloud_url_label">LLM URL / IP Address</Form.Label>
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
                    <Col className="col-12">
                        <Form.Label htmlFor="image_config_cloud_api_key_label">LLM API Key</Form.Label>
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
                </>
            }
        </>
    )
}

export default ConfigImage