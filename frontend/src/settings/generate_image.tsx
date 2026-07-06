import { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap"
import Form from 'react-bootstrap/Form';
import { GenerateImageOptions } from "../constants/mode";
import { GetAppConfigValue, StoreAppConfigValue } from "../../wailsjs/go/main/App"
import { IAppConfig, ISettingGenerateImage } from "../interfaces/config.interfaces";

function SettingGenerateImage(props: ISettingGenerateImage) {
    const [settingImage, setSettingImage] = useState<IAppConfig>({ModeGeneratePrompt:"", ModeGenerateImage:""})
    const [settingImageDefault, setSettingImageDefault] = useState<IAppConfig>({ModeGeneratePrompt:"", ModeGenerateImage:""})

    useEffect(() => {
        GetAppConfigValue().then((value) => {
            setSettingImage({ModeGeneratePrompt: value.mode_generate_prompt, ModeGenerateImage: value.mode_generate_image})
            setSettingImageDefault({ModeGeneratePrompt: value.mode_generate_prompt, ModeGenerateImage: value.mode_generate_image})
        })
    }, [])

    const handleModeGenerateImageChange = (e:any) => {
        setSettingImage({ModeGeneratePrompt:settingImage.ModeGenerateImage, ModeGenerateImage:e.target.value})

        props.onChangeSource(e.target.value)
    }

    function handleSaveModeGenerateImage() {
        StoreAppConfigValue({
            mode_generate_prompt: settingImage.ModeGeneratePrompt,
            mode_generate_image: settingImage.ModeGenerateImage
        }).then(() => {
            setSettingImageDefault({ModeGeneratePrompt: settingImage.ModeGeneratePrompt, ModeGenerateImage: settingImage.ModeGenerateImage})
        })
    }

    return(
        <Form>
            <Row className="w-full">
                <Col className="col-12">
                    <h4 className="mb-2">Generate Image Model Source:</h4>
                </Col>
                <Col className="col-3">
                    <Form.Check
                        type="radio"
                        label={GenerateImageOptions.LOCAL.label}
                        name="modeGenerateImage"
                        id="generate-image-local"
                        value={GenerateImageOptions.LOCAL.value}
                        checked={settingImage.ModeGenerateImage === GenerateImageOptions.LOCAL.value}
                        onChange={handleModeGenerateImageChange}
                    />
                </Col>
                <Col className="col-3">
                    <Form.Check
                        type="radio"
                        label={GenerateImageOptions.CLOUD.label}
                        name="modeGenerateImage"
                        id="generate-image-cloud"
                        value={GenerateImageOptions.CLOUD.value}
                        checked={settingImage.ModeGenerateImage === GenerateImageOptions.CLOUD.value}
                        onChange={handleModeGenerateImageChange}
                    />
                </Col>
                <Col className="col-12">
                    <Button variant="success" disabled={settingImage.ModeGenerateImage == settingImageDefault.ModeGenerateImage} onClick={handleSaveModeGenerateImage} className="mt-2">Save</Button>
                </Col>
            </Row>
        </Form>
    )
}

export default SettingGenerateImage