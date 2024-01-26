import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as ReviewActions from '../../store/reviews';
import './Reviews.css';
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import PostReviewModal from "./PostReviewModal";

function formatUpdatedAt(updatedAt) {
    const date = new Date(updatedAt);
    const formattedDate = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'long' }).format(date);
    return formattedDate;
}

function Reviews({ spot }){
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const user = useSelector(state => state.session.user);
    const reviewObject = useSelector(state => state.reviews?.reviews);
    const reviewArr = reviewObject 
        ? Object.values(reviewObject)
            .filter(review => review.spotId === +spotId)
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)) // Sorting in descending order
        : [];

    useEffect(() => {
        dispatch(ReviewActions.getAllReviews(+spotId));
    }, [dispatch, spotId]);

    const hasReviewed = reviewArr.some(review => review.User.id == user?.id);

    return (
        <div className="review-container">

            <div className="review-header">
                <div>
                    <img 
                        className='reviews-RB-star-image'
                        src='https://static.vecteezy.com/system/resources/thumbnails/001/189/165/small/star.png'
                    />
                    {`${spot.avgStarRating !== 'no ratings available' ? spot.avgStarRating.toFixed(2) : 'New'} `} 
                    {` ${spot.numReviews > 0 ? (spot.numReviews === 1 ? '• 1 Review' : `• ${spot.numReviews} Reviews`) : ''}`}
                </div>

                <div>
                { user && user.id !== spot.ownerId && !hasReviewed ?
                    <button className='spot-review-button'>
                        <OpenModalMenuItem
                        modalComponent={<PostReviewModal spotId={spot.id} />}
                        itemText='Post Your Review'
                        />
                    </button>
                    : ''
                }
                </div>
            </div>
            
            <div className="review-body">
                {reviewArr.length === 0 && user && user.id !== spot.ownerId
                    ?
                    <h2>Be the first to post a review!</h2>
                    :
                reviewArr.map(review => (
                    <div key={review.id} className="review-individual">
                        <h2>{review.User.firstName}</h2>
                        <h4>{formatUpdatedAt(review.updatedAt)}</h4>
                        <p>{review.review}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Reviews;