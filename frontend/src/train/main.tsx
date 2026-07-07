import { useState } from "react"
import { SelectImages, EncodeImagesFromPath, Dump, StartImageTraining } from "../../wailsjs/go/main/App"
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CarouselPreview from "./carousel_preview";
import { PlayFill } from "react-bootstrap-icons";

function Main() {
    const [imagePaths, setImagePaths] = useState<string[]>([])
    const [previews, setPreviews] = useState<string[]>([])

    function handleOpenFileDialog() {    
        SelectImages().then((paths) => {
            loadImages(paths)

            setImagePaths(paths)
        })
    }

    function loadImages(paths: string[]) {
        EncodeImagesFromPath(paths).then((encodedImages: string[]) => {
            const imageUrls: string[] = []

            encodedImages.map((base64Data: string) => {
                const byteChars = atob(base64Data)
                const byteNumbers = new Array(byteChars.length)

                for (let i = 0; i < byteChars.length; i++) {
                    byteNumbers[i] = byteChars.charCodeAt(i)
                }
                
                const byteArray = new Uint8Array(byteNumbers)
                
                const imageBlob = new Blob([byteArray], { type: 'image/jpeg' })

                imageUrls.push(URL.createObjectURL(imageBlob))
            })

            setPreviews(imageUrls)
        })
    }

    function startTraining() {
        Dump('start training')

        StartImageTraining().then((value) => {
            Dump("training completed")
            Dump(value)
        })
    }

    const removeImage = (urlToRemove: any, index: number) => {
        setImagePaths((prev) => prev.filter((_, i) => i !== index)) // remove image from array of paths to be processed by the LLM

        setPreviews((prev) => prev.filter((_, i) => i !== index)) // remove image from carousel preview

        URL.revokeObjectURL(urlToRemove)
    };

    return (
        <Row>
            <Col className="col-12">
                <div className="d-flex mt-2 gap-2 flex-wrap justify-content-center rounded-5 p-3 border border-1 border-primary">
                    {previews.length == 0 ?
                        <div className="d-flex justify-content-center align-items-center" style={{height: "400px", width:"100%"}}>
                            <Button onClick={_ => handleOpenFileDialog()} variant="primary">Import Images</Button>
                        </div>
                        : 
                        <CarouselPreview previews={previews} onRemoveImage={removeImage} />}
                </div>
            </Col>
            <Col className={`${previews.length == 0 ? "d-none" : "col-12"}`}>
                <div className="d-flex mt-2 flex-wrap rounded-5 p-3 border border-1 border-primary">
                    <h3>Path:</h3>
                    <ul className="w-100 mb-0">
                        {imagePaths.map(item => 
                            <li>{item}</li>
                        )}
                    </ul>
                </div>
            </Col>
            <Col className={`${previews.length == 0 ? "d-none" : "col-12"}`}>
                <div className="d-flex flex-wrap p-3 justify-content-center align-items-center">
                    <Button variant="success" onClick={startTraining}>Start Training <PlayFill /></Button>
                </div>
            </Col>
        </Row>
    )
}

export default Main