import { csrfFetch } from "./csrf";
const LOG_IN = 'session/LOG_IN';
const LOG_OUT = 'session/LOG_OUT';

const logIn = user => ({
    type: LOG_IN,
    user
});

const logOut = () => ({
    type: LOG_OUT
});

export const login = (user) => async dispatch => {
    const {credential, password} = user;
    const response = await csrfFetch('/api/session', {
        method: 'POST',
        // headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({credential, password})
    });
    const data = await response.json();

    if (response.ok){
        dispatch(logIn(data.user));
        return data;
    } else {
        return data;
    }
};

export const demoLogin = () => async dispatch => {
    const credential = 'Demo-lition';
    const password = 'password';
    const response = await csrfFetch('/api/session', {
        method: 'POST',
        body: JSON.stringify({credential, password})
    });
    const data = await response.json();

    if (response.ok) dispatch(logIn(data.user));
    return data;
}

export const restoreUser = () => async dispatch => {
    const response = await csrfFetch('/api/session');
    const data = await response.json();
    dispatch(logIn(data.user));
    return data;
};

export const signup = (user) => async (dispatch) => {
    const { username, firstName, lastName, email, password } = user;
    const response = await csrfFetch("/api/users", {
      method: "POST",
      body: JSON.stringify({
        username,
        firstName,
        lastName,
        email,
        password
      })
    });
    const data = await response.json();

    if (response.ok) dispatch(logIn(data.user));
    return data;
};

export const logout = () => async dispatch => {
    const response = await csrfFetch('/api/session', {
        method: 'DELETE'
    });

    dispatch(logOut());
    return response;
}

const initialState = {user: null};

const sessionReducer = (state = initialState, action) => {
    switch(action.type){
        case LOG_IN:
            return {
                ...state,
                user: action.user
            };
        case LOG_OUT:
            return {
                ...state,
                user: null
            };
        default:
            return state;
    }
};

export default sessionReducer;