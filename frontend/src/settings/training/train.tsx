import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap"
import Form from 'react-bootstrap/Form';
import { IConfigTraining, ISettingTraining } from "../../interfaces/config.interfaces";
import { TrainingOptions } from "../../constants/mode";

function SettingTraining(props: ISettingTraining) {
    const [settingTraining, setSettingTraining] = useState<IConfigTraining>({Mode:"", Model: "", URLLocal:"", URLCloud:"", APIKeyCloud:""})

    useEffect(() => {
        setSettingTraining({Mode:props.data.Mode, Model: props.data.Model, URLLocal:props.data.URLLocal, URLCloud:props.data.URLCloud, APIKeyCloud:props.data.APIKeyCloud})
    }, [props])

    const handleModeTrainingChange = (e:any) => {
        setSettingTraining({
            ...settingTraining,
            Mode: e.target.value
        })

        props.onChangeSource(e.target.value)
    }

    return(
        <Form>
            <Row className="w-full">
                <Col className="col-12">
                    <h4 className="mb-2">Training Model Source:</h4>
                </Col>
                <Col className="col-6">
                    <Form.Check
                        type="radio"
                        label={TrainingOptions.LOCAL.label}
                        name="modeTraining"
                        id="training-local"
                        value={TrainingOptions.LOCAL.value}
                        checked={settingTraining.Mode === TrainingOptions.LOCAL.value}
                        onChange={handleModeTrainingChange}
                    />
                </Col>
                <Col className="col-6">
                    <Form.Check
                        type="radio"
                        label={TrainingOptions.CLOUD.label}
                        name="modeTraining"
                        id="training-cloud"
                        value={TrainingOptions.CLOUD.value}
                        checked={settingTraining.Mode === TrainingOptions.CLOUD.value}
                        onChange={handleModeTrainingChange}
                    />
                </Col>
            </Row>
        </Form>
    )
}

export default SettingTraining