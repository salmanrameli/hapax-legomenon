import { Button, Col, Row } from "react-bootstrap"
import SettingGenerateImage from "./generate_image";
import { useEffect, useState } from "react";
import { GetGenerateImageConfigValue, StoreGenerateImageConfigValue } from "../../../wailsjs/go/main/App"
import ConfigImage from "./config_image";
import { IConfigGenerateImage } from "../../interfaces/config.interfaces";

interface IImageSettingMain {
    projectId: string
}

function ImageSettingMain(props: IImageSettingMain) {
    const [generateImageDetail, setGenerateImageDetail] = useState<IConfigGenerateImage>({Mode:"", Model:"", URLLocal: "", URLCloud: "", APIKeyCloud:"", Steps: 0, Dimension: 0})
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
                Dimension: value.dimension
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

    const handleChangeDimension = (dimension: number) => {
        setGenerateImageDetail({
            ...generateImageDetail,
            Dimension: dimension
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
            dimension: generateImageDetail.Dimension
        }).then(() => {
            setDisableSaveButton(true)
        })
    }

    return (
        <Row>
            <Col className={"col-12"}>
                <div className="d-inline-flex w-100 flex-wrap p-3 border border-dark border-2">
                    <SettingGenerateImage data={generateImageDetail} onChangeSource={handleChangeSourceImage} onChangeDimension={handleChangeDimension} onSaveChanges={handleSaveChanges} />
                </div>
                <div className="d-inline-flex w-100 mt-2 flex-wrap p-3 border border-dark border-2">
                    {show && <ConfigImage source={generateImageDetail.Mode} defaultValue={generateImageDetail!} onChangeConfig={handleChangeConfig} onSaveChanges={handleSaveChanges} />}
                </div>
                <Button variant="success" onClick={handleSaveChanges} disabled={disableSaveButton} className="mt-2 rounded-0">Save</Button>
            </Col>
        </Row>
    )
}

export default ImageSettingMain