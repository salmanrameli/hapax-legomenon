import { Button, Col, Row } from "react-bootstrap"
import { useEffect, useState } from "react";
import { GetTrainingConfigValue, StoreTrainingConfigValue } from "../../../wailsjs/go/main/App"
import { IConfigTraining } from "../../interfaces/config.interfaces";
import ConfigTraining from "./config_training";
import SettingTraining from "./train";

function TrainingSettingMain() {
    const [trainingDetail, setTrainingDetail] = useState<IConfigTraining>({Mode:"", Model: "", URLLocal: "", URLCloud: "", APIKeyCloud:""})
    const [show, setShow] = useState<boolean>(false)
    const [disableSaveButton, setDisableSaveButton] = useState<boolean>(true)

    useEffect(() => {        
        GetTrainingConfigValue().then((value) => {
            setTrainingDetail({
                Mode: value.mode,
                Model: value.model,
                URLLocal: value.url_local,
                URLCloud: value.url_cloud,
                APIKeyCloud: value.api_key_cloud
            })

            setDisableSaveButton(true)
        }).then(() => {
            setShow(true)
        })
    }, [])

    // useEffect(() => {
    //     if (trainingDetail.Mode !== "" ) {
    //         setShow(true)
    //     }
    // }, [trainingDetail])

    const handleChangeSourceTraining = (data: string) => {
        setTrainingDetail({
            ...trainingDetail,
            Mode: data
        })

        setDisableSaveButton(false)
    }

    const handleChangeConfig = (data: IConfigTraining) => {
        setTrainingDetail({
            ...trainingDetail,
            Model: data.Model,
            URLLocal: data.URLLocal,
            URLCloud: data.URLCloud,
            APIKeyCloud: data.APIKeyCloud
        })

        setDisableSaveButton(false)
    }

    const handleSaveChanges = () => {        
        StoreTrainingConfigValue({
            mode: trainingDetail.Mode,
            model: trainingDetail.Model,
            url_local: trainingDetail.URLLocal,
            url_cloud: trainingDetail.URLCloud,
            api_key_cloud: trainingDetail.APIKeyCloud
        }).then(() => {
            setDisableSaveButton(true)
        })
    }

    return (
        <Row>
            <Col className={"col-12"}>
                <div className="d-inline-flex w-100 flex-wrap p-3 border border-dark border-2">
                    <SettingTraining data={trainingDetail} onChangeSource={handleChangeSourceTraining} onSaveChanges={handleSaveChanges} />
                </div>
                <div className="d-inline-flex w-100 mt-2 flex-wrap p-3 border border-dark border-2">
                    {show && <ConfigTraining source={trainingDetail.Mode} defaultValue={trainingDetail!} onChangeConfig={handleChangeConfig} onSaveChanges={handleSaveChanges} />}
                </div>
                <Button variant="success" onClick={handleSaveChanges} disabled={disableSaveButton} className="mt-2 rounded-0">Save</Button>
            </Col>
        </Row>
    )
}

export default TrainingSettingMain