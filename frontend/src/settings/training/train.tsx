import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap"
import Form from 'react-bootstrap/Form';
import { IConfigTraining, ISettingTraining } from "../../interfaces/config.interfaces";
import { TrainingOptions } from "../../constants/mode";
import { HddStack } from "react-bootstrap-icons";

function SettingTraining(props: ISettingTraining) {
    const [settingTraining, setSettingTraining] = useState<IConfigTraining>({Mode:"", ModelImageAnalysis: "", ModelTokenizingTexts:"", URLLocal:"", URLCloud:"", APIKeyCloud:""})

    useEffect(() => {
        setSettingTraining({Mode:props.data.Mode, ModelImageAnalysis: props.data.ModelImageAnalysis, ModelTokenizingTexts:props.data.ModelTokenizingTexts, URLLocal:props.data.URLLocal, URLCloud:props.data.URLCloud, APIKeyCloud:props.data.APIKeyCloud})
    }, [props])

    const handleModeTrainingChange = (e:any) => {
        setSettingTraining({
            ...settingTraining,
            Mode: e.target.value
        })

        props.onChangeSource(e.target.value)
    }

    return(
        <Row className="w-100">
            <Col className="col-12 d-inline-flex">
                <Col sm={1} className="d-flex justify-content-start align-items-center">
                    <HddStack size={45} />
                </Col>
                <Col sm={5} className="">
                    <h5 className="mt-2 text-hapax-primary">Training Model Source</h5>
                    <p className="mb-0 text-hapax-tertiary">Choose where your training model is hosted.</p>
                </Col>
                <Col sm={5} className="d-flex justify-content-start align-items-center">
                    <div className="d-inline-flex align-items-center">
                        <Form.Check
                            className="ms-3"
                            type="radio"
                            label={TrainingOptions.LOCAL.label}
                            name="modeGenerateImage"
                            id="generate-image-local"
                            value={TrainingOptions.LOCAL.value}
                            checked={settingTraining.Mode === TrainingOptions.LOCAL.value}
                            onChange={handleModeTrainingChange}
                        />
                        <Form.Check
                            className="ms-5"
                            type="radio"
                            label={TrainingOptions.CLOUD.label}
                            name="modeGenerateImage"
                            id="generate-image-cloud"
                            value={TrainingOptions.CLOUD.value}
                            disabled={true}
                            checked={settingTraining.Mode === TrainingOptions.CLOUD.value}
                            onChange={handleModeTrainingChange}
                        />
                    </div>
                </Col>
            </Col>
        </Row>
    )
}

export default SettingTraining