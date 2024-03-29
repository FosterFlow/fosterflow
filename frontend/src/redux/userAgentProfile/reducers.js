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
    profile: null,
    id: 0,
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

    avatar: defaultAvatarImage,
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
                profile: null,
                id: 0,
                firstName: '',
                lastName: '',
                avatar: defaultAvatarImage,
                getUserAgentProfileLoading: false,
                getUserAgentProfileSuccess: false,
                getUserAgentProfileErrors: null 
            };

        case GET_USER_AGENT_PROFILE_SUCCESS:{
            const profileData = action.payload;    
            const serverAvatar = profileData.avatar;
            
            let avatar = defaultAvatarImage; 
            
            if (serverAvatar) {
                avatar = serverAvatar;
            }

            return { 
                ...state, 
                profile: profileData,
                avatar: avatar,
                firstName: profileData.first_name,
                lastName: profileData.last_name,
                id: profileData.id,
                getUserAgentProfileLoading: false,
                getUserAgentProfileSuccess: true,
                getUserAgentProfileErrors: null 
            };
        }

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

        case UPDATE_USER_AGENT_PROFILE_DATA_SUCCESS:{
            const profileData = action.payload;    
            const serverAvatar = profileData.avatar;
            
            let avatar = defaultAvatarImage; 
            
            if (serverAvatar) {
                avatar = serverAvatar;
            }

            return { 
                ...state, 
                profile: profileData,
                avatar: avatar,
                firstName: profileData.first_name,
                lastName: profileData.last_name,
                id: profileData.id,
                userAgentProfileDataLoading: false,
                userAgentProfileDataErrors: null,
                userAgentProfileDataSuccess: true 
            };
        }

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
                updatedAvatar = newAvatar;
            }

            return { 
                ...state, 
                avatar: updatedAvatar,
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