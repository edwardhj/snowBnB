import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as spotActions from '../../store/spots';
import './DeleteSpotModal.css';

function DeleteSpotModal({ spotId }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const onConfirm = () => {
        dispatch(spotActions.deleteOneSpot(spotId));
        closeModal();
    };
    const onCancel = () => {
        closeModal();
    };

    return (
        <div className='delete-spot-modal'>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to remove this spot from the listings?</p>
            <button className="delete-confirm-button" onClick={() => onConfirm()}>Yes (Delete Spot)</button>
            <button className="delete-cancel-button" onClick={() => onCancel()}>No (Keep Spot)</button>
        </div>
    )

}

export default DeleteSpotModal;