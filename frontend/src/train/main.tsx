import { useState } from "react"
import { SelectImages } from "../../wailsjs/go/main/App"
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CarouselPreview from "./carousel_preview";

function Main() {
    const [imagePaths, setImagePaths] = useState<string[]>()
    const [previews, setPreviews] = useState<string[]>([])

    function handleOpenFileDialog() {    
        SelectImages().then((path) => {
            const imageUrls: string[] = []

            path.map((base64Data: string) => {
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

    const removeImage = (urlToRemove: any, index: number) => {
        setPreviews((prev) => prev.filter((_, i) => i !== index))

        URL.revokeObjectURL(urlToRemove)
    };

    return (
        <Row>
            <Col>
                <Button onClick={_ => handleOpenFileDialog()} variant="outline-primary">Select Images</Button>
                {previews.length > 0 && 
                    <div className="d-flex mt-2 gap-2 flex-wrap justify-content-center rounded-5 p-3 border border-1 border-primary">
                        <CarouselPreview previews={previews} onRemoveImage={removeImage} />
                    </div>
                }
            </Col>
        </Row>
    )
}

export default Main