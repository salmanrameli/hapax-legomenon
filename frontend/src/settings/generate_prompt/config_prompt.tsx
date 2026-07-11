import { useEffect, useState } from 'react';
import { Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { GeneratePromptOptions } from '../../constants/mode';
import { IConfigGeneratePrompt, IConfigGeneratePromptParams } from '../../interfaces/config.interfaces';

function ConfigPrompt(props: IConfigGeneratePromptParams) {
    const [promptConfig, setPromptConfig] = useState<IConfigGeneratePrompt>({Mode:props.defaultValue.Mode, Model:props.defaultValue.Model, URLLocal:props.defaultValue.URLLocal, URLCloud:props.defaultValue.URLCloud, APIKeyCloud:props.defaultValue.APIKeyCloud})

    useEffect(() => {
        if (props.defaultValue.URLLocal != "") {
            setPromptConfig({
                Mode: props.defaultValue.Mode,
                Model: props.defaultValue.Model,
                URLLocal: props.defaultValue.URLLocal,
                URLCloud: props.defaultValue.URLCloud,
                APIKeyCloud: props.defaultValue.APIKeyCloud
            })
        }
    }, [])

    useEffect(() => {
        props.onChangeConfig(promptConfig)
    }, [promptConfig])

    function handleChange(key: string, value: string) {
        if (key == "model") {
            setPromptConfig({...promptConfig, Model: value})
        } else if (key == "url_local") {
            setPromptConfig({...promptConfig, URLLocal: value})
        } else if (key == "url_cloud") {
            setPromptConfig({...promptConfig, URLCloud: value})
        } else if (key == "api_key") {
            setPromptConfig({...promptConfig, APIKeyCloud: value})
        }
    }

    return(
        <>
            <Col className="col-12">
                <h4 className="mb-2">Generate Prompt Model Address:</h4>
            </Col>
            {
                props.source == GeneratePromptOptions.LOCAL.value ? 
                <>
                    <Col className="col-12">
                        <Form.Label htmlFor="prompt_config_local_url_label">LLM URL / IP Address</Form.Label>
                        <Form.Control
                            type="text"
                            id="prompt_config_local_url_form_input"
                            size={"lg"}
                            value={promptConfig.URLLocal}
                            onChange={(e) => {handleChange("url_local", e.target.value)}}
                        />
                        <Form.Text id="prompt_config_local_url_form_input_info" muted>
                            Enter the URL or the IP address of the LLM running on your local machine
                        </Form.Text>
                    </Col>
                    <Col className="col-12">
                        <Form.Label htmlFor="prompt_config_local_model_label">Model Name</Form.Label>
                        <Form.Control
                            type="text"
                            id="prompt_config_local_model_form_input"
                            size={"lg"}
                            value={promptConfig.Model}
                            onChange={(e) => {handleChange("model", e.target.value)}}
                        />
                        <Form.Text id="prompt_config_local_model_form_input_info" muted>
                            Enter the name of the model you will be using
                        </Form.Text>
                    </Col>
                </>
                :
                <>
                    <Col className="col-12">
                        <Form.Label htmlFor="prompt_config_cloud_url_label">LLM URL / IP Address</Form.Label>
                        <Form.Control
                            type="text"
                            id="prompt_config_cloud_url_form_input"
                            size={"lg"}
                            value={promptConfig.URLCloud}
                            onChange={(e) => {handleChange("url_cloud", e.target.value)}}
                        />
                        <Form.Text id="prompt_config_cloud_url_form_input_info" muted>
                            Enter the URL or the IP address of the LLM running on the cloud
                        </Form.Text>
                    </Col>
                    <Col className="col-12">
                        <Form.Label htmlFor="prompt_config_cloud_api_key_label">LLM API Key</Form.Label>
                        <Form.Control
                            type="text"
                            id="prompt_config_cloud_api_key_form_input"
                            size={"lg"}
                            value={promptConfig.APIKeyCloud}
                            onChange={(e) => {handleChange("api_key", e.target.value)}}
                        />
                        <Form.Text id="prompt_config_cloud_api_key_form_input_info" muted>
                            Enter your user's LLM API key
                        </Form.Text>
                    </Col>
                    <Col className="col-12">
                        <Form.Label htmlFor="prompt_config_cloud_model_label">Model Name</Form.Label>
                        <Form.Control
                            type="text"
                            id="prompt_config_cloud_model_form_input"
                            size={"lg"}
                            value={promptConfig.Model}
                            onChange={(e) => {handleChange("model", e.target.value)}}
                        />
                        <Form.Text id="prompt_config_cloud_model_form_input_info" muted>
                            Enter the name of the model you will be using
                        </Form.Text>
                    </Col>
                </>
            }
        </>
    )
}

export default ConfigPrompt