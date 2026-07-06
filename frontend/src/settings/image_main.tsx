import { Col, Row } from "react-bootstrap"
import { useEffect, useState } from "react";
import { GetAppConfigValue } from "../../wailsjs/go/main/App"
import SettingGenerateImage from "./generate_image";
import ConfigImage from "./config_image";

function ImageMain() {
    const [generateImageSource, setGenerateImageSource] = useState<string>("")

    useEffect(() => {
        GetAppConfigValue().then((value) => {
            setGenerateImageSource(value.mode_generate_image)
        })
    }, [])

    const handleChangeSourceImage = (source: string) => {
        setGenerateImageSource(source)
    }

    return (
        <Row>
            <Col className={"col-12"}>
                <div className="d-inline-flex w-100 mt-2 flex-wrap p-3 border border-1 rounded-3 border-primary">
                    <SettingGenerateImage onChangeSource={handleChangeSourceImage} />
                </div>
                <div className="d-inline-flex w-100 mt-2 flex-wrap p-3 border border-1 rounded-3 border-primary">
                    <ConfigImage imageSource={generateImageSource} />
                </div>
            </Col>
        </Row>
    )
}

export default ImageMain