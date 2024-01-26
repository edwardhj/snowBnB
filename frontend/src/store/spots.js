import { csrfFetch } from "./csrf";

const LOAD_SPOTS = 'spots/LOAD_SPOTS';
const LOAD_ONE_SPOT = 'spots/LOAD_ONE_SPOT';
const CREATE_SPOT = 'spots/CREATE_SPOT';
const UPDATE_SPOT = 'spots/UPDATE_SPOT';

const loadSpots = (spotList) => ({
    type: LOAD_SPOTS,
    spotList
});

const loadOneSpot = (spot) => ({
    type: LOAD_ONE_SPOT,
    spot
});

const createSpot = (spot) => ({
    type: CREATE_SPOT,
    spot
});

const updateSpot = (spot) => ({
    type: UPDATE_SPOT,
    spot
});

export const getAllSpots = () => async dispatch => {
    const response = await csrfFetch('/api/spots');
    const spots = await response.json();
    dispatch(loadSpots(spots));
    return spots;
};

export const getOneSpot = (spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}`);
    const spot = await response.json();

    if (response.ok){
        dispatch(loadOneSpot(spot));
        return spot;
    } else return spot;
};

export const createOneSpot = (spotData, imgs) => async dispatch => {
    const response = await csrfFetch('/api/spots', {
        method: 'POST',
        body: JSON.stringify(spotData)
    });
    const newSpot = await response.json();

    for (const img of imgs) {
        await csrfFetch(`/api/spots/${newSpot.id}/images`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ spotId: newSpot.id, url: img.url, preview: img.preview })
        });
    }

    if (response.ok) dispatch(createSpot(newSpot));
    return newSpot;
};

export const updateOneSpot = (spotData) => async dispatch => {
    console.log(spotData)
    const response = await csrfFetch(`/api/spots/${spotData.id}`, {
        method: 'PUT',
        body: JSON.stringify(spotData)
    });
    const updatedSpot = await response.json();
    console.log(updatedSpot)

    // for (const img of imgs) {
    //     await csrfFetch(`/api/spots/${updatedSpot.id}/images`, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({ spotId: updatedSpot.id, url: img.url, preview: img.preview })
    //     });
    // }
    if (response.ok) dispatch(updateSpot(updatedSpot));
    return updatedSpot;
};



const initialState = {spots: {}, spot: {}};

const spotReducer = (state = initialState, action) => {
    switch(action.type){
        case LOAD_SPOTS: {
            const allSpots = {};
            action.spotList.Spots.forEach(spot => allSpots[spot.id] = spot);
            return {...state, spots: allSpots};
        }
        case LOAD_ONE_SPOT: {
            return {
                ...state,
                spot: {
                    ...state.spot,
                    [action.spot.id]: action.spot
                }
            }
        }
        case CREATE_SPOT: {
            const newSpot = action.spot;
            return {
                ...state,
                spots: {
                    ...state.spots,
                    [newSpot.id]: newSpot
                }
            }
        }
        case UPDATE_SPOT: {
            const updatedSpot = action.spot;
            const currentSpot = state.spot[action.spot.id];
            return {
                ...state,
                spot: {
                    ...state.spot,
                    [action.spot.id]: {
                        ...currentSpot,
                        ...updatedSpot
                    }
                }
            }
        }
        default:
            return state;
    }
};

export default spotReducer;