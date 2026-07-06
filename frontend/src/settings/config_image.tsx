import { useEffect, useState } from 'react';
import { Button, Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { GetLocalConfigValue, GetCloudConfigValue, StoreLocalConfigValue, StoreCloudConfigValue } from '../../wailsjs/go/main/App';
import { GenerateImageOptions } from '../constants/mode';
import { ILocalConfig, ICloudConfig, IConfigImage } from '../interfaces/config.interfaces';

function ConfigImage(props: IConfigImage) {
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

    function handleSaveImageConfig() {
        if (props.imageSource == GenerateImageOptions.LOCAL.value) {
            StoreLocalConfigValue({url_generate_prompt: localConfigDefault.URLGeneratePrompt, url_generate_image: localConfig.URLGenerateImage}).then(() => {
                setLocalConfigDefault({URLGeneratePrompt: localConfigDefault.URLGeneratePrompt, URLGenerateImage: localConfig.URLGenerateImage})
            })
        } else if (props.imageSource == GenerateImageOptions.CLOUD.value) {
            StoreCloudConfigValue({url_generate_prompt: cloudConfigDefault.URLGeneratePrompt, api_key_generate_prompt: cloudConfigDefault.API_KEY_GeneratePrompt, url_generate_image: cloudConfig.URLGenerateImage, api_key_generate_image: cloudConfig.API_KEY_GenerateImage}).then(() => {
                setCloudConfigDefault({URLGeneratePrompt: cloudConfigDefault.URLGeneratePrompt, API_KEY_GeneratePrompt: cloudConfigDefault.API_KEY_GeneratePrompt, URLGenerateImage: cloudConfig.URLGenerateImage, API_KEY_GenerateImage: cloudConfig.API_KEY_GenerateImage})
            })
        }
    }

    return(
        <>
            <Col className="col-12">
                <h4 className="mb-2">Generate Image Model Address:</h4>
            </Col>
            {
                props.imageSource == GenerateImageOptions.LOCAL.value ? 
                <>
                    <Col className="col-12">
                        <Form.Label htmlFor="image_config_local_url_label">LLM URL / IP Address</Form.Label>
                        <Form.Control
                            type="text"
                            id="image_config_local_url_form_input"
                            size={"lg"}
                            value={localConfig.URLGenerateImage}
                            onChange={(e) => {setLocalConfig({URLGeneratePrompt: localConfigDefault.URLGeneratePrompt, URLGenerateImage: e.target.value})}}
                        />
                        <Form.Text id="prompt_config_local_url_form_input_info" muted>
                            Enter the URL or the IP address of the LLM running on your local machine
                        </Form.Text>
                    </Col>
                    <Col className="col-12 mt-2">
                        <Button variant={"success"} disabled={localConfig.URLGenerateImage == localConfigDefault.URLGenerateImage} onClick={handleSaveImageConfig}>Save</Button>
                    </Col>
                </>
                :
                <>
                    <Col className="col-12">
                        <Form.Label htmlFor="image_config_cloud_api_key_label">LLM URL / IP Address</Form.Label>
                        <Form.Control
                            type="text"
                            id="image_config_cloud_url_form_input"
                            size={"lg"}
                            value={cloudConfig.URLGenerateImage}
                            onChange={(e) => {setCloudConfig({URLGeneratePrompt: cloudConfigDefault.URLGeneratePrompt, API_KEY_GeneratePrompt: cloudConfigDefault.API_KEY_GeneratePrompt, URLGenerateImage: e.target.value, API_KEY_GenerateImage: cloudConfigDefault.URLGenerateImage})}}
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
                            value={cloudConfig.API_KEY_GenerateImage}
                            onChange={(e) => {setCloudConfig({URLGeneratePrompt: cloudConfigDefault.URLGeneratePrompt, API_KEY_GeneratePrompt: cloudConfigDefault.API_KEY_GeneratePrompt, URLGenerateImage: cloudConfig.URLGenerateImage, API_KEY_GenerateImage: e.target.value})}}
                        />
                        <Form.Text id="image_config_cloud_api_key_form_input_info" muted>
                            Enter your user's LLM API key
                        </Form.Text>
                    </Col>
                    <Col className="col-12 mt-2">
                        <Button variant={"success"} disabled={cloudConfig.URLGenerateImage == cloudConfigDefault.URLGenerateImage && cloudConfig.API_KEY_GenerateImage == cloudConfigDefault.API_KEY_GenerateImage} onClick={handleSaveImageConfig}>Save</Button>
                    </Col>
                </>
            }
        </>
    )
}

export default ConfigImage