import { useEffect, useState } from 'react';
import { Button, Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { GetCloudConfigValue, GetLocalConfigValue, StoreCloudConfigValue, StoreLocalConfigValue } from '../../wailsjs/go/main/App';
import { GeneratePromptOptions } from '../constants/mode';
import { IConfigPrompts, ILocalConfig, ICloudConfig } from '../interfaces/config.interfaces';

function ConfigPrompt(props: IConfigPrompts) {
    const [localConfig, setLocalConfig] = useState<ILocalConfig>({URLGeneratePrompt: "", URLGenerateImage: ""})
    const [localConfigDefault, setLocalConfigDefault] = useState<ILocalConfig>({URLGeneratePrompt: "", URLGenerateImage: ""})

    const [cloudConfig, setCloudConfig] = useState<ICloudConfig>({URLGeneratePrompt: "", API_KEY_GeneratePrompt: "", URLGenerateImage: "", API_KEY_GenerateImage: ""})
    const [cloudConfigDefault, setCloudConfigDefault] = useState<ICloudConfig>({URLGeneratePrompt: "", API_KEY_GeneratePrompt: "", URLGenerateImage: "", API_KEY_GenerateImage: ""})

    useEffect(() => {
        GetLocalConfigValue().then((value) => {
            setLocalConfig({URLGeneratePrompt: value.url_generate_prompt, URLGenerateImage: value.url_generate_image})
            setLocalConfigDefault({URLGeneratePrompt: value.url_generate_prompt, URLGenerateImage: value.url_generate_image})
        })

        GetCloudConfigValue().then((value) => {
            setCloudConfig({URLGeneratePrompt: value.url_generate_prompt, API_KEY_GeneratePrompt: value.api_key_generate_prompt, URLGenerateImage: value.url_generate_image, API_KEY_GenerateImage: value.api_key_generate_image})
            setCloudConfigDefault({URLGeneratePrompt: value.url_generate_prompt, API_KEY_GeneratePrompt: value.api_key_generate_prompt, URLGenerateImage: value.url_generate_image, API_KEY_GenerateImage: value.api_key_generate_image})
        })
    }, [])

    function handleSavePromptConfig() {
        if (props.promptSource == GeneratePromptOptions.LOCAL.value) {
            StoreLocalConfigValue({url_generate_prompt: localConfig.URLGeneratePrompt, url_generate_image: localConfig.URLGenerateImage}).then(() => {
                setLocalConfigDefault({URLGeneratePrompt: localConfig.URLGeneratePrompt, URLGenerateImage: localConfigDefault.URLGenerateImage})
            })
        } else if (props.promptSource == GeneratePromptOptions.CLOUD.value) {
            StoreCloudConfigValue({url_generate_prompt: cloudConfig.URLGeneratePrompt, api_key_generate_prompt: cloudConfig.API_KEY_GeneratePrompt, url_generate_image: cloudConfigDefault.URLGenerateImage, api_key_generate_image: cloudConfigDefault.API_KEY_GenerateImage}).then(() => {
                setCloudConfigDefault({URLGeneratePrompt: cloudConfig.URLGeneratePrompt, API_KEY_GeneratePrompt: cloudConfig.API_KEY_GeneratePrompt, URLGenerateImage: cloudConfigDefault.URLGenerateImage, API_KEY_GenerateImage: cloudConfigDefault.API_KEY_GenerateImage})
            })
        }
    }

    return(
        <>
            <Col className="col-12">
                <h4 className="mb-2">Generate Prompt Model Address:</h4>
            </Col>
            {
                props.promptSource == GeneratePromptOptions.LOCAL.value ? 
                <>
                    <Col className="col-12">
                        <Form.Label htmlFor="prompt_config_local_url_label">LLM URL / IP Address</Form.Label>
                        <Form.Control
                            type="text"
                            id="prompt_config_local_url_form_input"
                            size={"lg"}
                            value={localConfig.URLGeneratePrompt}
                            onChange={(e) => {setLocalConfig({URLGeneratePrompt: e.target.value, URLGenerateImage: localConfigDefault.URLGenerateImage})}}
                        />
                        <Form.Text id="prompt_config_local_url_form_input_info" muted>
                            Enter the URL or the IP address of the LLM running on your local machine
                        </Form.Text>
                    </Col>
                    <Col className="col-12 mt-2">
                        <Button variant={"success"} disabled={localConfig.URLGeneratePrompt == localConfigDefault.URLGeneratePrompt} onClick={handleSavePromptConfig}>Save</Button>
                    </Col>
                </>
                :
                <>
                    <Col className="col-12">
                        <Form.Label htmlFor="prompt_config_cloud_api_key_label">LLM URL / IP Address</Form.Label>
                        <Form.Control
                            type="text"
                            id="prompt_config_cloud_url_form_input"
                            size={"lg"}
                            value={cloudConfig.URLGeneratePrompt}
                            onChange={(e) => {setCloudConfig({URLGeneratePrompt: e.target.value, API_KEY_GeneratePrompt: cloudConfig.API_KEY_GeneratePrompt, URLGenerateImage: cloudConfigDefault.URLGenerateImage, API_KEY_GenerateImage: localConfigDefault.URLGenerateImage})}}
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
                            value={cloudConfig.API_KEY_GeneratePrompt}
                            onChange={(e) => {setCloudConfig({URLGeneratePrompt: cloudConfig.URLGeneratePrompt, API_KEY_GeneratePrompt: e.target.value, URLGenerateImage: cloudConfigDefault.URLGenerateImage, API_KEY_GenerateImage: cloudConfigDefault.API_KEY_GenerateImage})}}
                        />
                        <Form.Text id="prompt_config_cloud_api_key_form_input_info" muted>
                            Enter your user's LLM API key
                        </Form.Text>
                    </Col>
                    <Col className="col-12 mt-2">
                        <Button variant={"success"} disabled={cloudConfig.URLGeneratePrompt == cloudConfigDefault.URLGeneratePrompt && cloudConfig.API_KEY_GeneratePrompt == cloudConfigDefault.API_KEY_GeneratePrompt} onClick={handleSavePromptConfig}>Save</Button>
                    </Col>
                </>
            }
        </>
    )
}

export default ConfigPrompt