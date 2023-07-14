import {
    GET_AUTHORIZED_USER,
    GET_AUTHORIZED_USER_SUCCESS,
    GET_USER,
    GET_USER_SUCCESS,
    UPDATE_USER,
    UPDATE_USER_SUCCESS,
    DELETE_USER,
    USER_FAILED,
    GET_USERS,
    GET_USERS_SUCCESS,
} from './constants';

const INIT_STATE = {
    user: null,
    loading: false,
    error: null
};

const User = (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_AUTHORIZED_USER:
        return { ...state, loading: true, error: null };

        case GET_AUTHORIZED_USER_SUCCESS:
        return { ...state, authorizedUser: action.payload, loading: false, error: null };

        case GET_USERS:
            return { ...state, loading: true, error: null };
        case GET_USERS_SUCCESS:
            return { ...state, users: action.payload, loading: false, error: null };

        case GET_USER:
        case UPDATE_USER:
            return { ...state, loading: true, error: null };
        
        case GET_USER_SUCCESS:
        case UPDATE_USER_SUCCESS:
            return { ...state, user: action.payload, loading: false, error: null };

        case DELETE_USER:
            return { ...state, user: null, loading: false, error: null };
        
        case USER_FAILED:
            return { ...state, loading: false, error: action.payload };

        default: return { ...state };
    }
}

export default User;
