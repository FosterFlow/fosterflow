import {
    GET_PROFILE,
    GET_PROFILE_SUCCESS,
    UPDATE_PROFILE,
    UPDATE_PROFILE_SUCCESS,
    PROFILE_FAILED
} from './constants';

const INIT_STATE = {
    profile: null,
    loading: false,
    error: null
};

const Profile = (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_PROFILE:
        
        case UPDATE_PROFILE:
            return { ...state, loading: true, error: null };
        
        case GET_PROFILE_SUCCESS:
        
        case UPDATE_PROFILE_SUCCESS:
            return { ...state, profile: action.payload, loading: false, error: null };

        case PROFILE_FAILED:
            return { ...state, loading: false, error: action.payload };

        default: return { ...state };
    }
}

export default Profile;
