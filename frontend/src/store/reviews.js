import { contextsKey } from "express-validator/src/base";
import { csrfFetch } from "./csrf";

const LOAD_REVIEWS = 'reviews/LOAD_REVIEWS';

const loadReviews = (reviewList) => ({
    type: LOAD_REVIEWS,
    reviewList
});

export const getAllReviews = (spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
    const reviews = await response.json();

    if (response.ok){
        dispatch(loadReviews(reviews));
    }
    return reviews;
};

const initialState = {reviews: {}};

const reviewReducer = (state = initialState, action) => {
    switch(action.type){
        case LOAD_REVIEWS: {
            const allReviews = {};
            action.reviewList.Reviews.forEach(review => allReviews[review.id] = review);
            return {...state, reviews: allReviews};
        }
        default:
            return state;
    }
};

export default reviewReducer;