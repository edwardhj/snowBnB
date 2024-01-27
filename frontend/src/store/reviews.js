import { csrfFetch } from "./csrf";
import * as spotActions from './spots'

const LOAD_REVIEWS = 'reviews/LOAD_REVIEWS';
const CREATE_REVIEW = 'reviews/CREATE_REVIEW';
const DELETE_REVIEW = 'reviews/DELETE_REVIEW';

const loadReviews = (reviewList) => ({
    type: LOAD_REVIEWS,
    reviewList
});

const createReview = (review) => ({
    type: CREATE_REVIEW,
    review
});

const deleteReview = (reviewId) => ({
    type: DELETE_REVIEW,
    reviewId
});

export const getAllReviews = (spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
    const reviews = await response.json();

    if (response.ok){
        dispatch(loadReviews(reviews));
    }
    return reviews;
};

export const createOneReview = (reviewData, spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        body: JSON.stringify(reviewData)
    });
    const review = await response.json();

    if (response.ok) {
        dispatch(createReview(review));
        dispatch(getAllReviews(spotId));
        dispatch(spotActions.getOneSpot(spotId));
    }
};

export const deleteOneReview = (reviewId, spotId) => async dispatch => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        dispatch(deleteReview(reviewId));
        dispatch(spotActions.getOneSpot(spotId));
    }
};

const initialState = {reviews: {}, review: {}};

const reviewReducer = (state = initialState, action) => {
    switch(action.type){
        case LOAD_REVIEWS: {
            const allReviews = {};
            action.reviewList.Reviews.forEach(review => allReviews[review.id] = review);
            return {...state, reviews: allReviews};
        }
        case CREATE_REVIEW: {
            return {
                ...state,
                review: {
                    ...state.review,
                    [action.review.id]: action.review
                }
            }
        }
        case DELETE_REVIEW: {
            const newState = { ...state };
            delete newState.reviews[action.reviewId];
            delete newState.reviews[action.reviewId];
            return newState;
        }
        default:
            return state;
    }
};

export default reviewReducer;