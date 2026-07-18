import { Button, Col, Row } from "react-bootstrap"
import SettingGenerateImage from "./generate_image";
import { useEffect, useState } from "react";
import { GetGenerateImageConfigValue, StoreGenerateImageConfigValue } from "../../../wailsjs/go/main/App"
import ConfigImage from "./config_image";
import { IConfigGenerateImage } from "../../interfaces/config.interfaces";
import { Floppy } from "react-bootstrap-icons";

interface IImageSettingMain {
    projectId: string
    availableModels: string[]
}

function ImageSettingMain(props: IImageSettingMain) {
    const [generateImageDetail, setGenerateImageDetail] = useState<IConfigGenerateImage>({Mode:"", Model:"", URLLocal: "", URLCloud: "", APIKeyCloud:"", Steps: 0, DimensionWidth: 0, DimensionHeight:0})
    const [show, setShow] = useState<boolean>(false)
    const [disableSaveButton, setDisableSaveButton] = useState<boolean>(true)

    useEffect(() => {
        setDisableSaveButton(true)
        
        GetGenerateImageConfigValue(props.projectId).then((value) => {
            setGenerateImageDetail({
                Mode: value.mode,
                Model: value.model,
                URLLocal: value.url_local,
                URLCloud: value.url_cloud,
                APIKeyCloud: value.api_key_cloud,
                Steps: value.steps,
                DimensionWidth: value.dimension_width,
                DimensionHeight: value.dimension_height
            })

            setDisableSaveButton(true)
        }).then(() => {
            setShow(true)
        })
    }, [])

    // useEffect(() => {
    //     if (generateImageDetail.Mode !== "" && (generateImageDetail.URLLocal !== "" || (generateImageDetail.URLCloud !== "" && generateImageDetail.APIKeyCloud !== ""))) {
    //         setShow(true)
    //     }
    // }, [generateImageDetail])

    const handleChangeSourceImage = (data: string) => {
        setGenerateImageDetail({
            ...generateImageDetail,
            Mode: data
        })

        setDisableSaveButton(false)
    }

    const handleChangeConfig = (data: IConfigGenerateImage) => {
        setGenerateImageDetail({
            ...generateImageDetail,
            Model: data.Model,
            URLLocal: data.URLLocal,
            URLCloud: data.URLCloud,
            APIKeyCloud: data.APIKeyCloud,
            Steps: data.Steps
        })

        setDisableSaveButton(false)
    }

    const handleChangeDimensionWidth = (dimension: number) => {
        setGenerateImageDetail({
            ...generateImageDetail,
            DimensionWidth: dimension
        })

        setDisableSaveButton(false)
    }

    const handleChangeDimensionHeight = (dimension: number) => {
        setGenerateImageDetail({
            ...generateImageDetail,
            DimensionHeight: dimension
        })

        setDisableSaveButton(false)
    }

    const handleSaveChanges = () => {        
        StoreGenerateImageConfigValue(props.projectId, {
            mode: generateImageDetail.Mode,
            model: generateImageDetail.Model,
            url_local: generateImageDetail.URLLocal,
            url_cloud: generateImageDetail.URLCloud,
            api_key_cloud: generateImageDetail.APIKeyCloud,
            steps: generateImageDetail.Steps,
            dimension_width: generateImageDetail.DimensionWidth,
            dimension_height: generateImageDetail.DimensionHeight
        }).then(() => {
            setDisableSaveButton(true)
        })
    }

    return (
        <Row>
            <Col className={"col-12"}>
                <div className="d-inline-flex w-100 flex-wrap p-3 rounded-4 border-hapax-primary hapax-box-shadow">
                    <SettingGenerateImage data={generateImageDetail} onChangeSource={handleChangeSourceImage} onChangeDimensionWidth={handleChangeDimensionWidth} onChangeDimensionHeight={handleChangeDimensionHeight} onSaveChanges={handleSaveChanges} />
                </div>
                <div className="w-100 mt-3 flex-wrap p-3 rounded-4 border-hapax-primary hapax-box-shadow">
                    {show && <ConfigImage source={generateImageDetail.Mode} defaultValue={generateImageDetail!} onChangeConfig={handleChangeConfig} onSaveChanges={handleSaveChanges} availableModels={props.availableModels} />}
                </div>
                <Button size="lg" onClick={handleSaveChanges} disabled={disableSaveButton} className="btn-hapax-primary border-hapax-primary hapax-box-shadow rounded-4 my-3 w-25"><Floppy style={{marginTop:"-3px", marginRight:"5px"}} /> Save</Button>
            </Col>
        </Row>
    )
}

export default ImageSettingMain