import { useEffect, useState } from "react"
import { Button, Col, Row } from "react-bootstrap"
import { GetPOVText, StorePOVText } from "../../../wailsjs/go/main/App"
import { ArrowLeftShort, Floppy } from "react-bootstrap-icons"

interface IConfigPOV {
    projectId: string
    handleBack: () => void
}

function ConfigPOV(props: IConfigPOV) {
    const [pov, SetPov] = useState<string>("")
    const [buttonText, setButtonText] = useState<string>("Save")
    const [disableSaveButton, setDisableSaveButton] = useState<boolean>(false)

    useEffect(() => {
        GetPOVText(props.projectId).then((value: string) => {
            SetPov(value)
        })
    }, [])

    function handleSaveChanges() {
        if (pov !== "") {
            StorePOVText(props.projectId, pov).then(() => {
                setButtonText("Saved!")
                setDisableSaveButton(true)
            })
        }
    }

    return (
        <Row>
            <Col sm={12}>
                <div className="d-flex bg-white gap-2 flex-wrap justify-content-center p-3 border-hapax-secondary hapax-box-shadow rounded-4">
                    <div className="d-flex" style={{height: "400px", width:"100%", overflowY:"scroll"}}>
                        <textarea style={{width:"100%", height:"100%", resize:"none", boxSizing:"border-box", border:"none", outline:"none"}} value={pov} onChange={(e) => SetPov(e.target.value)} />
                    </div>
                </div>
                <Button size="lg" onClick={() => props.handleBack()} className="btn-hapax-primary border-hapax-primary hapax-box-shadow rounded-4 mt-3 me-3"><ArrowLeftShort style={{marginTop:"-3px", marginRight:"5px"}} /> Back</Button>
                <Button size="lg" onClick={handleSaveChanges} disabled={pov == "" || disableSaveButton} className="btn-hapax-primary border-hapax-primary hapax-box-shadow rounded-4 mt-3 w-25"><Floppy style={{marginTop:"-3px", marginRight:"5px"}} />{buttonText}</Button>
            </Col>
        </Row>
    )
}

export default ConfigPOV