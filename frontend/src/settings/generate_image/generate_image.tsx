import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap"
import Form from 'react-bootstrap/Form';
import { GenerateImageOptions, ImageDimensionOptions } from "../../constants/mode";
import { IConfigGenerateImage, ISettingGenerateImage } from "../../interfaces/config.interfaces";
import { ArrowsAngleExpand, HddStack } from "react-bootstrap-icons";

function SettingGenerateImage(props: ISettingGenerateImage) {
    const [settingImage, setSettingImage] = useState<IConfigGenerateImage>({Mode:"", Model: "", URLLocal:"", URLCloud:"", APIKeyCloud:"", Steps:0, DimensionWidth:0, DimensionHeight: 0})

    useEffect(() => {
        setSettingImage({Mode:props.data.Mode, Model:props.data.Model, URLLocal:props.data.URLLocal, URLCloud:props.data.URLCloud, APIKeyCloud:props.data.APIKeyCloud, Steps:props.data.Steps, DimensionWidth:props.data.DimensionWidth, DimensionHeight:props.data.DimensionHeight})
    }, [props])

    const handleModeGenerateImageChange = (e:any) => {
        setSettingImage({
            ...settingImage,
            Mode: e.target.value
        })

        props.onChangeSource(e.target.value)
    }

    const handleSetImageDimensionWidth = (e:any) => {
        setSettingImage({
            ...settingImage,
            DimensionWidth: parseInt(e.target.value)
        })

        props.onChangeDimensionWidth(parseInt(e.target.value))
    }

    const handleSetImageDimensionHeight = (e:any) => {
        setSettingImage({
            ...settingImage,
            DimensionHeight: parseInt(e.target.value)
        })

        props.onChangeDimensionHeight(parseInt(e.target.value))
    }

    return(
        <Row className="w-100">
            <Col className="col-12 d-inline-flex">
                <Col sm={1} className="d-flex justify-content-start align-items-center">
                    <HddStack size={45} />
                </Col>
                <Col sm={5} className="">
                    <h5 className="mt-2 text-hapax-primary">Generate Image Model Source</h5>
                    <p className="mb-0 text-hapax-tertiary">Select where your model to generate image is hosted.</p>
                </Col>
                <Col sm={5} className="d-flex justify-content-start align-items-center">
                    <div className="d-inline-flex align-items-center">
                        <Form.Check
                            className="ms-3"
                            type="radio"
                            label={GenerateImageOptions.LOCAL.label}
                            name="modeGenerateImage"
                            id="generate-image-local"
                            value={GenerateImageOptions.LOCAL.value}
                            checked={settingImage.Mode === GenerateImageOptions.LOCAL.value}
                            onChange={handleModeGenerateImageChange}
                        />
                        <Form.Check
                            className="ms-5"
                            type="radio"
                            label={GenerateImageOptions.CLOUD.label}
                            name="modeGenerateImage"
                            id="generate-image-cloud"
                            value={GenerateImageOptions.CLOUD.value}
                            disabled={true}
                            checked={settingImage.Mode === GenerateImageOptions.CLOUD.value}
                            onChange={handleModeGenerateImageChange}
                        />
                    </div>
                </Col>
            </Col>
            <Col className="col-12 d-inline-flex mt-3">
                <Col sm={1} className="d-flex justify-content-start align-items-center">
                    <ArrowsAngleExpand size={35} className="ms-2" />
                </Col>
                <Col sm={5} className="">
                    <h5 className="mt-2 text-hapax-primary">Dimension</h5>
                    <p className="mb-0 text-hapax-tertiary">Set the dimension of the generated image</p>
                </Col>
                <Col sm={5} className="justify-content-center align-items-center">
                    <div className="w-100">
                        <div className="d-inline-flex w-100">
                            <p>Width:</p>
                            <Form.Check
                                className="ms-3"
                                type="radio"
                                label={ImageDimensionOptions.sm.label}
                                name="setImageDimensionWidth"
                                id="image-width-size-sm"
                                value={ImageDimensionOptions.sm.value}
                                checked={settingImage.DimensionWidth === ImageDimensionOptions.sm.value}
                                onChange={handleSetImageDimensionWidth}
                            />
                            <Form.Check
                                className="ms-5"
                                type="radio"
                                label={ImageDimensionOptions.md.label}
                                name="setImageDimensionWidth"
                                id="image-width-size-md"
                                value={ImageDimensionOptions.md.value}
                                checked={settingImage.DimensionWidth === ImageDimensionOptions.md.value}
                                onChange={handleSetImageDimensionWidth}
                            />
                            <Form.Check
                                className="ms-5"
                                type="radio"
                                label={ImageDimensionOptions.lg.label}
                                name="setImageDimensionWidth"
                                id="image-width-size-lg"
                                value={ImageDimensionOptions.lg.value}
                                checked={settingImage.DimensionWidth === ImageDimensionOptions.lg.value}
                                onChange={handleSetImageDimensionWidth}
                            />
                        </div>
                    </div>
                    <div className="w-100">
                        <div className="d-inline-flex w-100">
                            <p>Height:</p>
                            <Form.Check
                                className="ms-3"
                                type="radio"
                                label={ImageDimensionOptions.sm.label}
                                name="setImageDimensionHeight"
                                id="image-height-size-sm"
                                value={ImageDimensionOptions.sm.value}
                                checked={settingImage.DimensionHeight === ImageDimensionOptions.sm.value}
                                onChange={handleSetImageDimensionHeight}
                            />
                            <Form.Check
                                className="ms-5"
                                type="radio"
                                label={ImageDimensionOptions.md.label}
                                name="setImageDimensionHeight"
                                id="image-height-size-md"
                                value={ImageDimensionOptions.md.value}
                                checked={settingImage.DimensionHeight === ImageDimensionOptions.md.value}
                                onChange={handleSetImageDimensionHeight}
                            />
                            <Form.Check
                                className="ms-5"
                                type="radio"
                                label={ImageDimensionOptions.lg.label}
                                name="setImageDimensionHeight"
                                id="image-height-size-lg"
                                value={ImageDimensionOptions.lg.value}
                                checked={settingImage.DimensionHeight === ImageDimensionOptions.lg.value}
                                onChange={handleSetImageDimensionHeight}
                            />
                        </div>
                    </div>
                </Col>
            </Col>
        </Row>
    )
}

export default SettingGenerateImage