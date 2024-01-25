import { csrfFetch } from "./csrf";

const CREATE_SPOT_IMAGE = 'images/CREATE_SPOT_IMAGE';


const createSpotImage = (img) => ({
    type: CREATE_SPOT_IMAGE,
    img
});

export const addSpotImage = (spotId, imageData) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(imageData)
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(addSpotImage(data));
        return data;
    } else {
        // Handle errors
        const errorData = await response.json();
        throw new Error(errorData.message);
    }
};

const initialState = {
    spotImages: {},
    reviewImages: {}
};

const imagesReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_SPOT_IMAGE: {
            return {
                ...state,
                images: {
                    ...state.images,
                    [action.img.id]: action.img
                }
            };
        }
        default:
            return state;
    }
};

export default imagesReducer;