import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useModal } from "../../context/Modal";
import * as reviewActions from '../../store/reviews';
import './PostReviewModal.css';

function PostReviewModal({ spotId }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const [review, setReview] = useState('');
    const [starRating, setStarRating] = useState('');
    const [stars, setStars] = useState('');
    const [disabled, setDisabled] = useState(true);
    const reviewNums = [1, 2, 3, 4, 5];

    useEffect(() => {
        if (review.length > 9 && stars > 0) setDisabled(false)
        else setDisabled(true)
    }, [review, stars]);

    const mouseHover = (num) => setStarRating(num);
    const mouseLeave = () => setStarRating(stars);

    const handleSubmit = e => {
        e.preventDefault();
        
        let newReview;
        newReview = {
            review,
            stars
        }
        dispatch(reviewActions.createOneReview(newReview, spotId));

        closeModal();
    }

    return (
        <div className='post-review-modal'>
            <h2>How was your stay?</h2>

            <form>
                <textarea 
                    value={review}
                    onChange={e => setReview(e.target.value)}
                    placeholder='Leave your review here...'
                />

                <div className="rating-container">
                    {reviewNums.map(num =>
                        (<span
                            className="review-star-container"
                            key={num}
                            onMouseEnter={() => mouseHover(num)}
                            onMouseLeave={mouseLeave}
                            onClick={() => setStars(num)}>
                            {starRating >= num ? <i className="fa-solid fa-star"></i>
                            : <i className="fa-regular fa-star"></i>}
                        </span>)
                    )} 
                    Stars
                </div>

                <button className='review-submission'
                    onClick={handleSubmit}
                    disabled={disabled}
                >
                    Submit Your Review
                </button>
            </form>

        </div>
    )

}


export default PostReviewModal;