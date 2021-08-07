
import './review-file-image.scss';

function ReviewFileImage({ url }: any) {
  return (
    <div className="view-file-image">
      <img src={url} alt="" />
    </div>
  )
}

export default ReviewFileImage;