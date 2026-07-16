import { Button, Col, Row } from "react-bootstrap"
import SettingGeneratePrompt from "./generate_prompt";
import { useEffect, useState } from "react";
import { GetGeneratePromptConfigValue, StoreGeneratePromptConfigValue } from "../../../wailsjs/go/main/App"
import ConfigPrompt from "./config_prompt";
import { IConfigGeneratePrompt } from "../../interfaces/config.interfaces";
import { Floppy } from "react-bootstrap-icons";

interface IPromptSettingMain {
    projectId: string
}

function PromptSettingMain(props: IPromptSettingMain) {
    const [generatePromptDetail, setGeneratePromptDetail] = useState<IConfigGeneratePrompt>({Mode:"", Model:"", URLLocal: "", URLCloud: "", APIKeyCloud:""})
    const [show, setShow] = useState<boolean>(false)
    const [disableSaveButton, setDisableSaveButton] = useState<boolean>(true)

    useEffect(() => {        
        GetGeneratePromptConfigValue(props.projectId).then((value) => {
            setGeneratePromptDetail({
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
    //     if (generatePromptDetail.Mode !== "" ) {
    //         setShow(true)
    //     }
    // }, [generatePromptDetail])

    const handleChangeSourcePrompt = (data: string) => {
        setGeneratePromptDetail({
            ...generatePromptDetail,
            Mode: data
        })

        setDisableSaveButton(false)
    }

    const handleChangeConfig = (data: IConfigGeneratePrompt) => {
        setGeneratePromptDetail({
            ...generatePromptDetail,
            Model: data.Model,
            URLLocal: data.URLLocal,
            URLCloud: data.URLCloud,
            APIKeyCloud: data.APIKeyCloud
        })

        setDisableSaveButton(false)
    }

    const handleSaveChanges = () => {        
        StoreGeneratePromptConfigValue(props.projectId, {
            mode: generatePromptDetail.Mode,
            model: generatePromptDetail.Model,
            url_local: generatePromptDetail.URLLocal,
            url_cloud: generatePromptDetail.URLCloud,
            api_key_cloud: generatePromptDetail.APIKeyCloud
        }).then(() => {
            setDisableSaveButton(true)
        })
    }

    return (
        <Row>
            <Col className={"col-12"}>
                <div className="d-inline-flex w-100 flex-wrap p-3 rounded-4 border-hapax-primary hapax-box-shadow">
                    <SettingGeneratePrompt data={generatePromptDetail} onChangeSource={handleChangeSourcePrompt} onSaveChanges={handleSaveChanges} />
                </div>
                <div className="w-100 mt-3 flex-wrap p-3 rounded-4 border-hapax-primary hapax-box-shadow">
                    {show && <ConfigPrompt source={generatePromptDetail.Mode} defaultValue={generatePromptDetail!} onChangeConfig={handleChangeConfig} onSaveChanges={handleSaveChanges} />}
                </div>
                <Button size="lg" onClick={handleSaveChanges} disabled={disableSaveButton} className="btn-hapax-primary border-hapax-primary hapax-box-shadow rounded-4 mt-3 w-25"><Floppy style={{marginTop:"-3px", marginRight:"5px"}} /> Save</Button>
            </Col>
        </Row>
    )
}

export default PromptSettingMain