import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as reviewActions from '../../store/reviews';
import './DeleteReviewModal.css';

function DeleteReviewModal({ reviewId, spotId }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const onConfirm = () => {
        dispatch(reviewActions.deleteOneReview(reviewId, spotId));
        closeModal();
    }


    return (
        <div className='delete-spot-modal'>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this review?</p>
            <button className="delete-confirm-button" onClick={onConfirm}>Yes (Delete Review)</button>
            <button className="delete-cancel-button" onClick={closeModal}>No (Keep Review)</button>
        </div>
    )
}

export default DeleteReviewModal;