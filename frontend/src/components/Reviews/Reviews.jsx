import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as ReviewActions from '../../store/reviews';
import './Reviews.css';

function formatUpdatedAt(updatedAt) {
    const date = new Date(updatedAt);
    const formattedDate = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'long' }).format(date);
    return formattedDate;
}

function Reviews(){
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const reviewObject = useSelector(state => state.reviews?.reviews);
    const reviewArr = reviewObject ? Object.values(reviewObject).filter(review => review.spotId === +spotId) : [];

    useEffect(() => {
        dispatch(ReviewActions.getAllReviews(+spotId));
    }, [dispatch, spotId]);

    if (!reviewArr.length){
        return (
            <h1> Be the first to post a review!</h1>
        )
    }

    return (
        <>
            <div className="review-header">
                Hey
            </div>
            
            <div className="review-body">
                {reviewArr.map(review => (
                    <div key={review.id} className="review-individual">
                        <h2>{review.User.firstName}</h2>
                        <h4>{formatUpdatedAt(review.updatedAt)}</h4>
                        <p>{review.review}</p>
                    </div>
                ))}
            </div>
        </>
    )
}

export default Reviews;