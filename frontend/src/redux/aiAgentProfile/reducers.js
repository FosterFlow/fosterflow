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
    AgentAiProfile: null,
    activeAgentAiProfileId: config.BASE_MODEL_AGENT_ID,
    activeAgentAiProfile: null,

    getAgentAiProfileLoading: false,
    getAgentAiProfileSuccess: false,
    getAgentAiProfileErrors: null,

    agentAiProfileDataLoading: false,
    agentAiProfileDataErrors: null,
    agentAiProfileDataSuccess: false,

    agentAiProfileAvatar: defaultAvatarImage,
    agentAiProfileAvatarLoading: false,
    agentAiProfileAvatarErrors: null,
    agentAiProfileAvatarSuccess: false
};

const AgentAiProfile = (state = INIT_STATE, action) => {
    switch (action.type) {
        case AI_AGENT_PROFILE_INIT:
            return INIT_STATE;

        case GET_AI_AGENT_PROFILE:
            return { 
                ...state, 
                getAgentAiProfileLoading: true,
                getAgentAiProfileSuccess: false,
                getAgentAiProfileErrors: null 
            };

        case GET_AI_AGENT_PROFILE_INIT_STATE:
            return { 
                ...state,
                getAgentAiProfileLoading: false,
                getAgentAiProfileSuccess: false,
                getAgentAiProfileErrors: null 
            };

        case GET_AI_AGENT_PROFILE_SUCCESS:
            const serverAvatar = action.payload.avatar;
            let avatar = defaultAvatarImage; 
            
            if (serverAvatar) {
                avatar = config.BACKEND_URL + serverAvatar;
            }

            return { 
                ...state, 
                AgentAiProfile: action.payload,
                agentAiProfileAvatar: avatar,
                getAgentAiProfileLoading: false,
                getAgentAiProfileSuccess: true,
                getAgentAiProfileErrors: null 
            };

        case GET_AI_AGENT_PROFILE_FAILED:
            return { 
                ...state,
                getAgentAiProfileLoading: false,
                getAgentAiProfileSuccess: false,
                getAgentAiProfileErrors: action.payload 
            };

        case UPDATE_AI_AGENT_PROFILE_DATA:
            return { 
                ...state,
                agentAiProfileDataLoading: true,
                agentAiProfileDataErrors: null,
                agentAiProfileDataSuccess: false 
            };

        case UPDATE_AI_AGENT_PROFILE_DATA_INIT_STATE:
            return { 
                ...state,
                agentAiProfileDataLoading: false,
                agentAiProfileDataErrors: null,
                agentAiProfileDataSuccess: false 
            };

        case UPDATE_AI_AGENT_PROFILE_DATA_SUCCESS:
            return { 
                ...state,
                AgentAiProfile: action.payload,
                agentAiProfileDataLoading: false,
                agentAiProfileDataErrors: null,
                agentAiProfileDataSuccess: true 
            };

        case UPDATE_AI_AGENT_PROFILE_DATA_FAILED:
            return { 
                ...state,
                agentAiProfileDataLoading: false,
                agentAiProfileDataErrors: action.payload,
                agentAiProfileDataSuccess: false 
            };

        case UPDATE_AI_AGENT_PROFILE_AVATAR:
            return { 
                ...state, 
                agentAiProfileAvatarLoading: true, 
                agentAiProfileAvatarErrors: null,
                agentAiProfileAvatarSuccess: false 
            };
        
        case UPDATE_AI_AGENT_PROFILE_AVATAR_INIT_STATE:
            return { 
                ...state, 
                agentAiProfileAvatarLoading: false, 
                agentAiProfileAvatarErrors: null,
                agentAiProfileAvatarSuccess: false 
            };
            
        case UPDATE_AI_AGENT_PROFILE_AVATAR_SUCCESS:
            const newAvatar = action.payload;
            let updatedAvatar = defaultAvatarImage;
            
            if (newAvatar) {
                updatedAvatar = config.BACKEND_URL + newAvatar;
            }

            return { 
                ...state, 
                agentAiProfileAvatar: updatedAvatar, 
                agentAiProfileAvatarLoading: false,
                agentAiProfileAvatarErrors: null,
                agentAiProfileAvatarSuccess: true
            };
            case UPDATE_AI_AGENT_PROFILE_AVATAR_FAILED:
                return { 
                    ...state, 
                    agentAiProfileAvatar: defaultAvatarImage, 
                    agentAiProfileAvatarLoading: false, 
                    agentAiProfileAvatarErrors: action.payload,
                    agentAiProfileAvatarSuccess: false 
                };
        
            default:
                return { ...state };
        }
    }

    export default AgentAiProfile;