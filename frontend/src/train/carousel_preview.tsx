import { Button } from 'react-bootstrap';
import Carousel from 'react-bootstrap/Carousel';
import { ArrowLeftShort, ArrowRightShort } from 'react-bootstrap-icons';

interface CarouselPreviewProps {
    previews: string[]
    onRemoveImage: (url:string, index: number) => void
}

function CarouselPreview(props: CarouselPreviewProps) {
    return (
        <Carousel slide={false} prevIcon={<ArrowLeftShort color={"black"} size={60} style={{marginLeft:"-150px"}} />} nextIcon={<ArrowRightShort color={"black"} size={60} style={{marginRight:"-150px"}} />}>
            {props.previews.map((url, index) => (
                <Carousel.Item>
                    <img src={url} alt="Preview" className="w-100 justify-content-center d-inline-grid" style={{ maxHeight: "400px", objectFit: "cover" }} />
                    <Carousel.Caption>
                        <Button variant="danger" onClick={() => props.onRemoveImage(url, index)}>Remove Image</Button>
                    </Carousel.Caption>
                </Carousel.Item>
            ))}
        </Carousel>
        // <>
        //     {props.previews.map((url, index) => (
        //         <div key={index} style={{ position: "relative" }}>
        //             <img src={url} alt="Preview" className="w-auto" style={{ maxHeight: "300px", objectFit: "cover" }} />
        //             <button 
        //                 onClick={() => props.onRemoveImage(url, index)}
        //                 style={{ position: "absolute", top: 0, right: 0, background: "red", color: "white" }}
        //                 >
        //             X
        //             </button>
        //         </div>
        //     ))}
        // </>
    )
}

export default CarouselPreview