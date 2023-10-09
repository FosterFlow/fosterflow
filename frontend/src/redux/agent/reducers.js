import {
    AGENT_INIT,
    GET_AGENT,
    GET_AGENT_INIT_STATE,
    GET_AGENT_SUCCESS,
    GET_AGENT_FAILED,

    UPDATE_AGENT_DATA,
    UPDATE_AGENT_DATA_INIT_STATE,
    UPDATE_AGENT_DATA_SUCCESS,
    UPDATE_AGENT_DATA_FAILED,
    
    UPDATE_AGENT_AVATAR,
    UPDATE_AGENT_AVATAR_INIT_STATE,
    UPDATE_AGENT_AVATAR_SUCCESS,
    UPDATE_AGENT_AVATAR_FAILED
} from './constants';
import defaultAvatarImage from  "../../assets/images/users/avatar_default.png";
import config from '../../config';

const INIT_STATE = {
    agent: null,
    getAgentLoading: false,
    getAgentSucess: false,
    getAgentErrors: null,

    agentDataLoading: false,
    agentDataErrors: null,
    agentDataSuccess: false,
    
    avatar: defaultAvatarImage,
    avatarLoading: false,
    avatarErrors: null,
    avatarSuccess: false
};

const Agent = (state = INIT_STATE, action) => {
    switch (action.type) {
        case AGENT_INIT:
            return INIT_STATE;
            
        case GET_AGENT:
            return { 
                ...state, 
                getAgentLoading: true,
                getAgentSucess: false,
                getAgentErrors: null, 
            }

        case GET_AGENT_INIT_STATE:
            return { 
                ...state, 
                getAgentLoading: false,
                getAgentSucess: false,
                getAgentErrors: null, 
            }
        
        case GET_AGENT_SUCCESS: {
            const serverAvatar = action.payload.avatar;
            let avatar = defaultAvatarImage; 
            
            if (serverAvatar) {
                avatar = config.BACKEND_URL + serverAvatar
            }

            return { 
                ...state, 
                agent: action.payload,
                avatar: avatar, 
                getAgentLoading: false,
                getAgentSucess: true,
                getAgentErrors: null, 
            };
        }
        case GET_AGENT_FAILED:
            return { 
                ...state,
                getAgentLoading: false,
                getAgentSucess: false,
                getAgentErrors: action.payload, 
            };
        
        case UPDATE_AGENT_DATA:
            return { 
                ...state,
                agentDataLoading: true,
                agentDataErrors: null,
                agentDataSuccess: false
            };

        case UPDATE_AGENT_DATA_INIT_STATE:
            return { 
                ...state,
                agentDataLoading: false,
                agentDataErrors: null,
                agentDataSuccess: false
            };
        
        case UPDATE_AGENT_DATA_SUCCESS:
            return { 
                ...state,
                agent: action.payload,
                agentDataLoading: false,
                agentDataErrors: null,
                agentDataSuccess: true
            };

        case UPDATE_AGENT_DATA_FAILED:
            return { 
                ...state,
                agentDataLoading: false,
                agentDataErrors: action.payload,
                agentDataSuccess: false
            };

        case UPDATE_AGENT_AVATAR:
            return { 
                ...state, 
                avatarLoading: true, 
                avatarErrors: null,
                avatarSuccess: false 
            };
        
        case UPDATE_AGENT_AVATAR_INIT_STATE:
            return { 
                ...state, 
                avatarLoading: false, 
                avatarErrors: null,
                avatarSuccess: false 
            };
            
        case UPDATE_AGENT_AVATAR_SUCCESS: {
            const serverAvatar = action.payload;
            let avatar = defaultAvatarImage; 
            
            if (serverAvatar) {
                avatar = config.BACKEND_URL + serverAvatar
            }
            
            return { 
                ...state, 
                avatar: avatar, 
                avatarLoading: false, 
                avatarErrors: null,
                avatarSuccess: true 
            };
        }

        case UPDATE_AGENT_AVATAR_FAILED:
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

export default Agent;