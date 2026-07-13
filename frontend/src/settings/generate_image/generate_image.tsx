import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap"
import Form from 'react-bootstrap/Form';
import { GenerateImageOptions, ImageDimensionOptions } from "../../constants/mode";
import { IConfigGenerateImage, ISettingGenerateImage } from "../../interfaces/config.interfaces";

function SettingGenerateImage(props: ISettingGenerateImage) {
    const [settingImage, setSettingImage] = useState<IConfigGenerateImage>({Mode:"", Model: "", URLLocal:"", URLCloud:"", APIKeyCloud:"", Steps:0, Dimension:0})

    useEffect(() => {
        setSettingImage({Mode:props.data.Mode, Model:props.data.Model, URLLocal:props.data.URLLocal, URLCloud:props.data.URLCloud, APIKeyCloud:props.data.APIKeyCloud, Steps:props.data.Steps, Dimension:props.data.Dimension})
    }, [props])

    const handleModeGenerateImageChange = (e:any) => {
        setSettingImage({
            ...settingImage,
            Mode: e.target.value
        })

        props.onChangeSource(e.target.value)
    }

    const handleSetImageDimension = (e:any) => {
        setSettingImage({
            ...settingImage,
            Dimension: parseInt(e.target.value)
        })

        props.onChangeDimension(parseInt(e.target.value))
    }

    return(
        <Form>
            <Row className="w-full">
                <Col className="col-12">
                    <h4 className="mb-2">Generate Image Model Source:</h4>
                </Col>
                <Col className="col-4">
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
                <Col className="col-4">
                    <Form.Check
                        type="radio"
                        label={GenerateImageOptions.CLOUD.label}
                        name="modeGenerateImage"
                        id="generate-image-cloud"
                        value={GenerateImageOptions.CLOUD.value}
                        disabled={true}
                        checked={settingImage.Mode === GenerateImageOptions.CLOUD.value}
                        onChange={handleModeGenerateImageChange}
                    />
                </Col>
                <Col className="col-4" />
                <Col className="col-12">
                    <h4 className="mb-2">Set Image Dimension:</h4>
                </Col>
                <Col className="col-4">
                    <Form.Check
                        type="radio"
                        label={ImageDimensionOptions.md.label}
                        name="setImageDimension"
                        id="image-size-md"
                        value={ImageDimensionOptions.md.value}
                        checked={settingImage.Dimension === ImageDimensionOptions.md.value}
                        onChange={handleSetImageDimension}
                    />
                </Col>
                <Col className="col-4">
                    <Form.Check
                        type="radio"
                        label={ImageDimensionOptions.lg.label}
                        name="setImageDimension"
                        id="image-size-lg"
                        value={ImageDimensionOptions.lg.value}
                        checked={settingImage.Dimension === ImageDimensionOptions.lg.value}
                        onChange={handleSetImageDimension}
                    />
                </Col>
                <Col className="col-4" />
            </Row>
        </Form>
    )
}

export default SettingGenerateImage