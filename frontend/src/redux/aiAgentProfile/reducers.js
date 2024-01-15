import {
    AI_AGENT_PROFILE_INIT,

    GET_AI_AGENT_PROFILE,
    GET_AI_AGENT_PROFILE_INIT_STATE,
    GET_AI_AGENT_PROFILE_SUCCESS,
    GET_AI_AGENT_PROFILE_FAILED,

    UPDATE_AI_AGENT_PROFILE_DATA,
    UPDATE_AI_AGENT_PROFILE_DATA_INIT_STATE,
    UPDATE_AI_AGENT_PROFILE_DATA_SUCCESS,
    UPDATE_AI_AGENT_PROFILE_DATA_FAILED,

    UPDATE_AI_AGENT_PROFILE_AVATAR,
    UPDATE_AI_AGENT_PROFILE_AVATAR_INIT_STATE,
    UPDATE_AI_AGENT_PROFILE_AVATAR_SUCCESS,
    UPDATE_AI_AGENT_PROFILE_AVATAR_FAILED
} from './constants';

import defaultAvatarImage from "../../assets/images/users/avatar_default.png";
import config from '../../config';

const INIT_STATE = {
    AiAgentProfile: null,
    activeAiAgentProfileId: config.BASE_MODEL_AGENT_ID,
    activeAiAgentProfile: null,

    getAiAgentProfileLoading: false,
    getAiAgentProfileSuccess: false,
    getAiAgentProfileErrors: null,

    aiAgentProfileDataLoading: false,
    aiAgentProfileDataErrors: null,
    aiAgentProfileDataSuccess: false,

    aiAgentProfileAvatar: defaultAvatarImage,
    aiAgentProfileAvatarLoading: false,
    aiAgentProfileAvatarErrors: null,
    aiAgentProfileAvatarSuccess: false
};

const AiAgentProfile = (state = INIT_STATE, action) => {
    switch (action.type) {
        case AI_AGENT_PROFILE_INIT:
            return INIT_STATE;

        case GET_AI_AGENT_PROFILE:
            return { 
                ...state, 
                getAiAgentProfileLoading: true,
                getAiAgentProfileSuccess: false,
                getAiAgentProfileErrors: null 
            };

        case GET_AI_AGENT_PROFILE_INIT_STATE:
            return { 
                ...state,
                getAiAgentProfileLoading: false,
                getAiAgentProfileSuccess: false,
                getAiAgentProfileErrors: null 
            };

        case GET_AI_AGENT_PROFILE_SUCCESS: {
            const serverAvatar = action.payload.avatar;
            let avatar = defaultAvatarImage; 
            
            if (serverAvatar) {
                avatar = config.BACKEND_URL + serverAvatar;
            }

            return { 
                ...state, 
                AiAgentProfile: action.payload,
                aiAgentProfileAvatar: avatar,
                getAiAgentProfileLoading: false,
                getAiAgentProfileSuccess: true,
                getAiAgentProfileErrors: null 
            };
        }

        case GET_AI_AGENT_PROFILE_FAILED:
            return { 
                ...state,
                getAiAgentProfileLoading: false,
                getAiAgentProfileSuccess: false,
                getAiAgentProfileErrors: action.payload 
            };

        case UPDATE_AI_AGENT_PROFILE_DATA:
            return { 
                ...state,
                aiAgentProfileDataLoading: true,
                aiAgentProfileDataErrors: null,
                aiAgentProfileDataSuccess: false 
            };

        case UPDATE_AI_AGENT_PROFILE_DATA_INIT_STATE:
            return { 
                ...state,
                aiAgentProfileDataLoading: false,
                aiAgentProfileDataErrors: null,
                aiAgentProfileDataSuccess: false
            };
    
        case UPDATE_AI_AGENT_PROFILE_DATA_SUCCESS:
            return { 
                ...state,
                AiAgentProfile: action.payload,
                aiAgentProfileDataLoading: false,
                aiAgentProfileDataErrors: null,
                aiAgentProfileDataSuccess: true 
            };
    
        case UPDATE_AI_AGENT_PROFILE_DATA_FAILED:
            return { 
                ...state,
                aiAgentProfileDataLoading: false,
                aiAgentProfileDataErrors: action.payload,
                aiAgentProfileDataSuccess: false 
            };
    
        case UPDATE_AI_AGENT_PROFILE_AVATAR:
            return { 
                ...state, 
                aiAgentProfileAvatarLoading: true, 
                aiAgentProfileAvatarErrors: null,
                aiAgentProfileAvatarSuccess: false 
            };
        
        case UPDATE_AI_AGENT_PROFILE_AVATAR_INIT_STATE:
            return { 
                ...state, 
                aiAgentProfileAvatarLoading: false, 
                aiAgentProfileAvatarErrors: null,
                aiAgentProfileAvatarSuccess: false 
            };
            
        case UPDATE_AI_AGENT_PROFILE_AVATAR_SUCCESS: {
            const newAvatar = action.payload;
            let updatedAvatar = defaultAvatarImage;
            
            if (newAvatar) {
                updatedAvatar = config.BACKEND_URL + newAvatar;
            }
    
            return { 
                ...state, 
                aiAgentProfileAvatar: updatedAvatar, 
                aiAgentProfileAvatarLoading: false,
                aiAgentProfileAvatarErrors: null,
                aiAgentProfileAvatarSuccess: true
            };
        }
    
        case UPDATE_AI_AGENT_PROFILE_AVATAR_FAILED:
            return { 
                ...state, 
                aiAgentProfileAvatar: defaultAvatarImage, 
                aiAgentProfileAvatarLoading: false, 
                aiAgentProfileAvatarErrors: action.payload,
                aiAgentProfileAvatarSuccess: false 
            };
    
        default:
            return { ...state };
    }
};

export default AiAgentProfile;