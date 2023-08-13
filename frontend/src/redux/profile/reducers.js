import {
    GET_PROFILE,
    GET_PROFILE_SUCCESS,
    GET_PROFILE_FAILED,
    UPDATE_PROFILE_DATA,
    UPDATE_PROFILE_DATA_SUCCESS,
    PROFILE_FAILED,
    UPDATE_PROFILE_AVATAR,
    UPDATE_PROFILE_AVATAR_SUCCESS
} from './constants';
import defaultAvatarImage from  "../../assets/images/users/avatar_default.png";

const INIT_STATE = {
    profile: null,
    loading: false,
    error: null,
    avatar: defaultAvatarImage
};

const Profile = (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_PROFILE:
            return { ...state, loading: true }
        
        case GET_PROFILE_SUCCESS:
            return { ...state, profile: action.payload, loading: false, error: null };

        case GET_PROFILE_FAILED:
            return { ...state, loading: false, error: action.payload };
        
        case UPDATE_PROFILE_DATA:
            return { ...state, loading: true, error: null };
        
        case UPDATE_PROFILE_DATA_SUCCESS:
            return { ...state, profile: action.payload, loading: false, error: null };

        case UPDATE_PROFILE_AVATAR:
            return { ...state, loading: true, error: null };
            
        case UPDATE_PROFILE_AVATAR_SUCCESS:
            return { ...state, avatar: action.payload, loading: false, error: null };

        case PROFILE_FAILED:
            return { ...state, loading: false, error: action.payload };

        default: return { ...state };
    }
}

export default Profile;
