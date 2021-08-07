
import './app-review-file.scss';
import ReviewFileImage from './review-file-image/review-file-image';

function AppReviewFile({ visible, url, type, onClose }: any) {
  
  function onCloseReview() {
    onClose(false);
  }

  return visible && (
    <div className="view-file-container">
      <div className="view-file-shadow" onClick={onCloseReview} />
      <div className="view-file-content">
        <ReviewFileImage url={url} />
      </div>
    </div>
  )
}

export default AppReviewFile;