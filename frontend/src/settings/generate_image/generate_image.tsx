import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap"
import Form from 'react-bootstrap/Form';
import { GenerateImageOptions } from "../../constants/mode";
import { IConfigGenerateImage, ISettingGenerateImage } from "../../interfaces/config.interfaces";

function SettingGenerateImage(props: ISettingGenerateImage) {
    const [settingImage, setSettingImage] = useState<IConfigGenerateImage>({Mode:"", URLLocal:"", URLCloud:"", APIKeyCloud:""})

    useEffect(() => {
        setSettingImage({Mode:props.data.Mode, URLLocal:props.data.URLLocal, URLCloud:props.data.URLCloud, APIKeyCloud:props.data.APIKeyCloud})
    }, [props])

    const handleModeGenerateImageChange = (e:any) => {
        setSettingImage({
            ...settingImage,
            Mode: e.target.value
        })

        props.onChangeSource(e.target.value)
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
                        checked={settingImage.Mode === GenerateImageOptions.LOCAL.value}
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
                        checked={settingImage.Mode === GenerateImageOptions.CLOUD.value}
                        onChange={handleModeGenerateImageChange}
                    />
                </Col>
            </Row>
        </Form>
    )
}

export default SettingGenerateImage