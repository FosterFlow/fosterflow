import {
    GET_PROFILE,
    GET_PROFILE_SUCCESS,
    GET_PROFILE_FAILED,
    UPDATE_PROFILE_DATA,
    UPDATE_PROFILE_DATA_SUCCESS,
    HIDE_PROFILE_DATA_SUCCESS_MESSAGE,
    UPDATE_PROFILE_DATA_FAILED,
    UPDATE_PROFILE_AVATAR,
    UPDATE_PROFILE_AVATAR_SUCCESS,
    HIDE_PROFILE_AVATAR_SUCCESS_MESSAGE,
    UPDATE_PROFILE_AVATAR_FAILED
} from './constants';
import defaultAvatarImage from  "../../assets/images/users/avatar_default.png";

const INIT_STATE = {
    errors: null,
    loading: false,
    profile: null,
    profileDataLoading: false,
    profileDataErrors: null,
    profileDataSuccess: false,
    avatar: defaultAvatarImage,
    avatarLoading: false,
    avatarErrors: null,
    avatarSuccess: false
};

const Profile = (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_PROFILE:
            return { ...state, loading: true }
        
        case GET_PROFILE_SUCCESS:
            return { ...state, profile: action.payload, loading: false, error: null };

        case GET_PROFILE_FAILED:
            return { ...state, loading: false, errors: action.payload };
        
        case UPDATE_PROFILE_DATA:
            return { 
                ...state,
                profileDataLoading: true,
                profileDataErrors: null,
                profileDataSuccess: false
            };
        
        case UPDATE_PROFILE_DATA_SUCCESS:
            return { 
                ...state,
                profile: action.payload,
                profileDataLoading: false,
                profileDataErrors: null,
                profileDataSuccess: true
            };

        case HIDE_PROFILE_DATA_SUCCESS_MESSAGE:
            return { 
                ...state,
                profileDataSuccess: false
            };

        case UPDATE_PROFILE_DATA_FAILED:
            return { 
                ...state,
                profileDataLoading: false,
                profileDataErrors: action.payload,
                profileDataSuccess: false
            };

        case UPDATE_PROFILE_AVATAR:
            return { 
                ...state, 
                avatarLoading: true, 
                avatarErrors: null,
                avatarSuccess: false 
            };
            
        case UPDATE_PROFILE_AVATAR_SUCCESS:
            return { 
                ...state, 
                avatar: action.payload, 
                avatarLoading: false, 
                avatarErrors: null,
                avatarSuccess: true 
            };

        case HIDE_PROFILE_AVATAR_SUCCESS_MESSAGE:
            return { 
                ...state, 
                avatarSuccess: false 
            };

        case UPDATE_PROFILE_AVATAR_FAILED:
            return { 
                ...state, 
                avatar: action.payload, 
                avatarLoading: false, 
                avatarErrors: null,
                avatarSuccess: false 
            };

        default: return { ...state };
    }
}

export default Profile;
