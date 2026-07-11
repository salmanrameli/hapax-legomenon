import { Button } from 'react-bootstrap';
import Carousel from 'react-bootstrap/Carousel';
import { ArrowLeftShort, ArrowRightShort, Trash3Fill } from 'react-bootstrap-icons';

interface ICarouselPreviewProps {
    previews: string[]
    onRemoveImage: (url:string, index: number) => void
}

function CarouselPreview(props: ICarouselPreviewProps) {
    return (
        <Carousel slide={false} interval={null} prevIcon={<ArrowLeftShort color={"black"} size={60} style={{marginLeft:"-150px"}} />} nextIcon={<ArrowRightShort color={"black"} size={60} style={{marginRight:"-150px"}} />}>
            {props.previews.map((url, index) => (
                <Carousel.Item>
                    <img src={url} alt="Preview" className="w-100 justify-content-center d-inline-grid" style={{ maxHeight: "400px", objectFit: "cover" }} />
                    <Carousel.Caption>
                        <Button variant="danger" className='rounded-0 border border-danger border-3' onClick={() => props.onRemoveImage(url, index)}><Trash3Fill style={{marginTop:"-4px"}} /> Remove Image</Button>
                    </Carousel.Caption>
                </Carousel.Item>
            ))}
        </Carousel>
    )
}

export default CarouselPreview