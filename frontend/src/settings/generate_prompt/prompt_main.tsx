import { Button, Col, Row } from "react-bootstrap"
import SettingGeneratePrompt from "./generate_prompt";
import { useEffect, useState } from "react";
import { GetGeneratePromptConfigValue, StoreGeneratePromptConfigValue } from "../../../wailsjs/go/main/App"
import ConfigPrompt from "./config_prompt";
import { IConfigGeneratePrompt } from "../../interfaces/config.interfaces";

function PromptMain() {
    const [generatePromptDetail, setGeneratePromptDetail] = useState<IConfigGeneratePrompt>({Mode:"", URLLocal: "", URLCloud: "", APIKeyCloud:""})
    const [show, setShow] = useState<boolean>(false)
    const [disableSaveButton, setDisableSaveButton] = useState<boolean>(true)

    useEffect(() => {        
        GetGeneratePromptConfigValue().then((value) => {
            setGeneratePromptDetail({
                Mode: value.mode,
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
            URLLocal: data.URLLocal,
            URLCloud: data.URLCloud,
            APIKeyCloud: data.APIKeyCloud
        })

        setDisableSaveButton(false)
    }

    const handleSaveChanges = () => {        
        StoreGeneratePromptConfigValue({
            mode: generatePromptDetail.Mode,
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
                <div className="d-inline-flex w-100 flex-wrap p-3 border border-1 rounded-3 border-primary">
                    <SettingGeneratePrompt data={generatePromptDetail} onChangeSource={handleChangeSourcePrompt} onSaveChanges={handleSaveChanges} />
                </div>
                <div className="d-inline-flex w-100 mt-2 flex-wrap p-3 border border-1 rounded-3 border-primary">
                    {show && <ConfigPrompt source={generatePromptDetail.Mode} defaultValue={generatePromptDetail!} onChangeConfig={handleChangeConfig} onSaveChanges={handleSaveChanges} />}
                </div>
                <Button variant="success" onClick={handleSaveChanges} disabled={disableSaveButton} className="mt-2">Save</Button>
            </Col>
        </Row>
    )
}

export default PromptMain