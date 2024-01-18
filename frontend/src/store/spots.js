import { csrfFetch } from "./csrf";

const LOAD_SPOTS = 'spots/LOAD_SPOTS';
const LOAD_ONE_SPOT = 'spots/LOAD_ONE_SPOT';

const loadSpots = (spotList) => ({
    type: LOAD_SPOTS,
    spotList
});

const loadOneSpot = (spot) => ({
    type: LOAD_ONE_SPOT,
    spot
})

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
}






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
        default:
            return state;
    }
};

export default spotReducer;