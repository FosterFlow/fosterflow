import {
    USER_AGENT_PROFILE_INIT,

    GET_USER_AGENT_PROFILE,
    GET_USER_AGENT_PROFILE_INIT_STATE,
    GET_USER_AGENT_PROFILE_SUCCESS,
    GET_USER_AGENT_PROFILE_FAILED,

    UPDATE_USER_AGENT_PROFILE_DATA,
    UPDATE_USER_AGENT_PROFILE_DATA_INIT_STATE,
    UPDATE_USER_AGENT_PROFILE_DATA_SUCCESS,
    UPDATE_USER_AGENT_PROFILE_DATA_FAILED,

    UPDATE_USER_AGENT_PROFILE_AVATAR,
    UPDATE_USER_AGENT_PROFILE_AVATAR_INIT_STATE,
    UPDATE_USER_AGENT_PROFILE_AVATAR_SUCCESS,
    UPDATE_USER_AGENT_PROFILE_AVATAR_FAILED
} from './constants';

import defaultAvatarImage from "../../assets/images/users/avatar_default.png";
import config from '../../config';

const INIT_STATE = {
    userAgentProfile: null,
    firstName: '',
    lastName: '',
    activeUserAgentProfileId: config.BASE_MODEL_AGENT_ID,
    activeUserAgentProfile: null,

    getUserAgentProfileLoading: false,
    getUserAgentProfileSuccess: false,
    getUserAgentProfileErrors: null,

    userAgentProfileDataLoading: false,
    userAgentProfileDataErrors: null,
    userAgentProfileDataSuccess: false,

    userAgentProfileAvatar: defaultAvatarImage,
    userAgentProfileAvatarLoading: false,
    userAgentProfileAvatarErrors: null,
    userAgentProfileAvatarSuccess: false
};

const UserAgentProfile = (state = INIT_STATE, action) => {
    switch (action.type) {
        case USER_AGENT_PROFILE_INIT:
            return INIT_STATE;

        case GET_USER_AGENT_PROFILE:
            return { 
                ...state, 
                getUserAgentProfileLoading: true,
                getUserAgentProfileSuccess: false,
                getUserAgentProfileErrors: null 
            };

        case GET_USER_AGENT_PROFILE_INIT_STATE:
            return { 
                ...state,
                getUserAgentProfileLoading: false,
                getUserAgentProfileSuccess: false,
                getUserAgentProfileErrors: null 
            };

        case GET_USER_AGENT_PROFILE_SUCCESS:
            const userData = action.payload;    
            const serverAvatar = userData.avatar;
            
            let avatar = defaultAvatarImage; 
            
            if (serverAvatar) {
                avatar = config.BACKEND_URL + serverAvatar;
            }

            return { 
                ...state, 
                UserAgentProfile: userData,
                userAgentProfileAvatar: avatar,
                firstName: userData.first_name,
                lastName: userData.last_name,
                getUserAgentProfileLoading: false,
                getUserAgentProfileSuccess: true,
                getUserAgentProfileErrors: null 
            };

        case GET_USER_AGENT_PROFILE_FAILED:
            return { 
                ...state,
                getUserAgentProfileLoading: false,
                getUserAgentProfileSuccess: false,
                getUserAgentProfileErrors: action.payload 
            };

        case UPDATE_USER_AGENT_PROFILE_DATA:
            return { 
                ...state,
                userAgentProfileDataLoading: true,
                userAgentProfileDataErrors: null,
                userAgentProfileDataSuccess: false 
            };

        case UPDATE_USER_AGENT_PROFILE_DATA_INIT_STATE:
            return { 
                ...state,
                userAgentProfileDataLoading: false,
                userAgentProfileDataErrors: null,
                userAgentProfileDataSuccess: false 
            };

        case UPDATE_USER_AGENT_PROFILE_DATA_SUCCESS:
            return { 
                ...state,
                UserAgentProfile: action.payload,
                userAgentProfileDataLoading: false,
                userAgentProfileDataErrors: null,
                userAgentProfileDataSuccess: true 
            };

        case UPDATE_USER_AGENT_PROFILE_DATA_FAILED:
            return { 
                ...state,
                userAgentProfileDataLoading: false,
                userAgentProfileDataErrors: action.payload,
                userAgentProfileDataSuccess: false 
            };

        case UPDATE_USER_AGENT_PROFILE_AVATAR:
            return { 
                ...state, 
                userAgentProfileAvatarLoading: true, 
                userAgentProfileAvatarErrors: null,
                userAgentProfileAvatarSuccess: false 
            };
        
        case UPDATE_USER_AGENT_PROFILE_AVATAR_INIT_STATE:
            return { 
                ...state, 
                userAgentProfileAvatarLoading: false, 
                userAgentProfileAvatarErrors: null,
                userAgentProfileAvatarSuccess: false 
            };
            
        case UPDATE_USER_AGENT_PROFILE_AVATAR_SUCCESS:
            const newAvatar = action.payload;
            let updatedAvatar = defaultAvatarImage;
            
            if (newAvatar) {
                updatedAvatar = config.BACKEND_URL + newAvatar;
            }

            return { 
                ...state, 
                userAgentProfileAvatar: updatedAvatar,
                userAgentProfileAvatarLoading: false,
                userAgentProfileAvatarErrors: null,
                userAgentProfileAvatarSuccess: true
                };
        
        case UPDATE_USER_AGENT_PROFILE_AVATAR_FAILED:
            return { 
                ...state, 
                userAgentProfileAvatar: defaultAvatarImage, 
                userAgentProfileAvatarLoading: false, 
                userAgentProfileAvatarErrors: action.payload, 
                userAgentProfileAvatarSuccess: false 
            };
            
        default:
            return { ...state };
    }
}

export default UserAgentProfile;