import { Button, Col, Row } from "react-bootstrap"
import { useEffect, useState } from "react";
import { GetTrainingConfigValue, StoreTrainingConfigValue } from "../../../wailsjs/go/main/App"
import { IConfigTraining } from "../../interfaces/config.interfaces";
import ConfigTraining from "./config_training";
import SettingTraining from "./train";
import { Floppy } from "react-bootstrap-icons";

interface ITrainingSettingMain {
    projectId: string
}

function TrainingSettingMain(props: ITrainingSettingMain) {
    const [trainingDetail, setTrainingDetail] = useState<IConfigTraining>({Mode:"", Model: "", URLLocal: "", URLCloud: "", APIKeyCloud:""})
    const [show, setShow] = useState<boolean>(false)
    const [disableSaveButton, setDisableSaveButton] = useState<boolean>(true)

    useEffect(() => {        
        GetTrainingConfigValue(props.projectId).then((value) => {
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
        StoreTrainingConfigValue(props.projectId, {
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
                <div className="d-inline-flex w-100 flex-wrap p-3 rounded-4 border-hapax-primary hapax-box-shadow">
                    <SettingTraining data={trainingDetail} onChangeSource={handleChangeSourceTraining} onSaveChanges={handleSaveChanges} />
                </div>
                <div className="w-100 mt-3 flex-wrap p-3 rounded-4 border-hapax-primary hapax-box-shadow">
                    {show && <ConfigTraining source={trainingDetail.Mode} defaultValue={trainingDetail!} onChangeConfig={handleChangeConfig} onSaveChanges={handleSaveChanges} />}
                </div>
                <Button size="lg" onClick={handleSaveChanges} disabled={disableSaveButton} className="btn-hapax-primary border-hapax-primary hapax-box-shadow rounded-4 mt-3 w-25"><Floppy style={{marginTop:"-3px", marginRight:"5px"}} /> Save</Button>
            </Col>
        </Row>
    )
}

export default TrainingSettingMain