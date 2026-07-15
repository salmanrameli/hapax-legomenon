import { Button, Col, Row } from "react-bootstrap"
import SettingGeneratePrompt from "./generate_prompt";
import { useEffect, useState } from "react";
import { GetGeneratePromptConfigValue, StoreGeneratePromptConfigValue } from "../../../wailsjs/go/main/App"
import ConfigPrompt from "./config_prompt";
import { IConfigGeneratePrompt } from "../../interfaces/config.interfaces";

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
                <div className="d-inline-flex w-100 flex-wrap p-3 border border-dark border-2">
                    <SettingGeneratePrompt data={generatePromptDetail} onChangeSource={handleChangeSourcePrompt} onSaveChanges={handleSaveChanges} />
                </div>
                <div className="d-inline-flex w-100 mt-2 flex-wrap p-3 border border-dark border-2">
                    {show && <ConfigPrompt source={generatePromptDetail.Mode} defaultValue={generatePromptDetail!} onChangeConfig={handleChangeConfig} onSaveChanges={handleSaveChanges} />}
                </div>
                <Button size="lg" onClick={handleSaveChanges} disabled={disableSaveButton} className="btn-hapax-primary border border-dark border-2 mt-2 rounded-0">Save</Button>
            </Col>
        </Row>
    )
}

export default PromptSettingMain