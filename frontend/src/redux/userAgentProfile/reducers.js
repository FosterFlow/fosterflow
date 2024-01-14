import {
    USER_AGENT_PROFILE_INIT,

    GET_USER_AGENT_PROFILE,
    GET_USER_AGENT_PROFILE_INIT_STATE,
    GET_USER_AGENT_PROFILE_SUCCESS,
    GET_USER_AGENT_PROFILE_FAILED,

    UPDATE_USER_AGENT_PROFILE_DATA,
    UPDATE_USER_AGENT PROFILE_DATA_INIT_STATE,
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
    AgentUserProfile: null,
    activeAgentUserProfileId: config.BASE_MODEL_AGENT_ID,
    activeAgentUserProfile: null,

    getAgentUserProfileLoading: false,
    getAgentUserProfileSuccess: false,
    getAgentUserProfileErrors: null,

    agentUserProfileDataLoading: false,
    agentUserProfileDataErrors: null,
    agentUserProfileDataSuccess: false,

    agentUserProfileAvatar: defaultAvatarImage,
    agentUserProfileAvatarLoading: false,
    agentUserProfileAvatarErrors: null,
    agentUserProfileAvatarSuccess: false
};

const AgentUserProfile = (state = INIT_STATE, action) => {
    switch (action.type) {
        case USER_AGENT_PROFILE_INIT:
            return INIT_STATE;

        case GET_USER_AGENT_PROFILE:
            return { 
                ...state, 
                getAgentUserProfileLoading: true,
                getAgentUserProfileSuccess: false,
                getAgentUserProfileErrors: null 
            };

        case GET_USER_AGENT_PROFILE_INIT_STATE:
            return { 
                ...state,
                getAgentUserProfileLoading: false,
                getAgentUserProfileSuccess: false,
                getAgentUserProfileErrors: null 
            };

        case GET_USER_AGENT_PROFILE_SUCCESS:
            const serverAvatar = action.payload.avatar;
            let avatar = defaultAvatarImage; 
            
            if (serverAvatar) {
                avatar = config.BACKEND_URL + serverAvatar;
            }

            return { 
                ...state, 
                AgentUserProfile: action.payload,
                agentUserProfileAvatar: avatar,
                getAgentUserProfileLoading: false,
                getAgentUserProfileSuccess: true,
                getAgentUserProfileErrors: null 
            };

        case GET_USER_AGENT_PROFILE_FAILED:
            return { 
                ...state,
                getAgentUserProfileLoading: false,
                getAgentUserProfileSuccess: false,
                getAgentUserProfileErrors: action.payload 
            };

        case UPDATE_USER_AGENT_PROFILE_DATA:
            return { 
                ...state,
                agentUserProfileDataLoading: true,
                agentUserProfileDataErrors: null,
                agentUserProfileDataSuccess: false 
            };

        case UPDATE_USER_AGENT_PROFILE_DATA_INIT_STATE:
            return { 
                ...state,
                agentUserProfileDataLoading: false,
                agentUserProfileDataErrors: null,
                agentUserProfileDataSuccess: false 
            };

        case UPDATE_USER_AGENT_PROFILE_DATA_SUCCESS:
            return { 
                ...state,
                AgentUserProfile: action.payload,
                agentUserProfileDataLoading: false,
                agentUserProfileDataErrors: null,
                agentUserProfileDataSuccess: true 
            };

        case UPDATE_USER_AGENT_PROFILE_DATA_FAILED:
            return { 
                ...state,
                agentUserProfileDataLoading: false,
                agentUserProfileDataErrors: action.payload,
                agentUserProfileDataSuccess: false 
            };

        case UPDATE_USER_AGENT_PROFILE_AVATAR:
            return { 
                ...state, 
                agentUserProfileAvatarLoading: true, 
                agentUserProfileAvatarErrors: null,
                agentUserProfileAvatarSuccess: false 
            };
        
        case UPDATE_USER_AGENT_PROFILE_AVATAR_INIT_STATE:
            return { 
                ...state, 
                agentUserProfileAvatarLoading: false, 
                agentUserProfileAvatarErrors: null,
                agentUserProfileAvatarSuccess: false 
            };
            
        case UPDATE_USER_AGENT_PROFILE_AVATAR_SUCCESS:
            const newAvatar = action.payload;
            let updatedAvatar = defaultAvatarImage;
            
            if (newAvatar) {
                updatedAvatar = config.BACKEND_URL + newAvatar;
            }

            return { 
                ...state, 
                agentUserProfileAvatar: updatedAvatar,
                agentUserProfileAvatarLoading: false,
                agentUserProfileAvatarErrors: null,
                agentUserProfileAvatarSuccess: true
                };
        
        case UPDATE_USER_AGENT_PROFILE_AVATAR_FAILED:
            return { 
                ...state, 
                agentUserProfileAvatar: defaultAvatarImage, 
                agentUserProfileAvatarLoading: false, 
                agentUserProfileAvatarErrors: action.payload, 
                agentUserProfileAvatarSuccess: false 
            };
            
            default:
                return { ...state };
        }
    }

export default AgentUserProfile;