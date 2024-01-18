
const LOAD_SPOTS = 'spots/LOAD_SPOTS';


const loadSpots = (spotList) => ({
    type: LOAD_SPOTS,
    spotList
});

export const getAllSpots = () => async dispatch => {
    const response = await fetch('/api/spots');
    const spots = await response.json();
    dispatch(loadSpots(spots));
    return spots;
};








const initialState = {};

const spotReducer = (state = initialState, action) => {
    switch(action.type){
        case LOAD_SPOTS: {
            const allSpots = {...state};
            console.log(action.spotList);
            action.spotList.Spots.forEach(spot => allSpots[spot.id] = spot);
            return allSpots;
        }
        default:
            return state;
    }
};

export default spotReducer;