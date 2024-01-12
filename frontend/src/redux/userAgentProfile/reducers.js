import {
    AGENT_INIT,

    GET_USER_AGENTS,
    GET_USER_AGENTS_INIT_STATE,
    GET_USER_AGENTS_SUCCESS,
    GET_USER_AGENTS_FAILED,

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
    //TODO: rename param names according to agents / current user/ current model 
    
    //current user's agent
    agent: null,

    //current ML model
    activeAgentId: config.BASE_MODEL_AGENT_ID,
    activeAgent: null,

    getAgentLoading: false,
    getAgentSuccess: false,
    getAgentErrors: null,

    agentDataLoading: false,
    agentDataErrors: null,
    agentDataSuccess: false,
    
    avatar: defaultAvatarImage,
    avatarLoading: false,
    avatarErrors: null,
    avatarSuccess: false
};

const Agents = (state = INIT_STATE, action) => {
    switch (action.type) {
        case AGENT_INIT:
            return INIT_STATE;

        //Setting default AI agent of the current chat, who will answer us
        case SET_ACTIVE_AGENT:
            return { 
                ...state, 
                activeAgentId: action.payload,
                setActiveAgentLoading: false,
                setActiveAgentSucess: false,
                setActiveAgentErrors: null,
        }

        case GET_USER_AGENTS:
            return { 
                ...state, 
                getUserAgentLoading: true,
                getUserAgentSucess: false,
                getUserAgentErrors: null, 
            }
    
        case GET_USER_AGENTS_INIT_STATE:
            return { 
                ...state,
                userAgents: [], 
                getUserAgentLoading: false,
                getUserAgentSucess: false,
                getUserAgentErrors: null, 
            }
            
        case GET_USER_AGENTS_SUCCESS: {
            return { 
                ...state, 
                userAgents: action.payload,
                getUserAgentLoading: false,
                getUserAgentSucess: true,
                getUserAgentErrors: null, 
            };
        }
        
        case GET_USER_AGENTS_FAILED:
            return { 
                ...state,
                getUserAgentLoading: false,
                getUserAgentSucess: false,
                getUserAgentErrors: action.payload, 
            };
            
        case GET_AGENT:
            return { 
                ...state, 
                getAgentLoading: true,
                getAgentSuccess: false,
                getAgentErrors: null, 
            }

        case GET_AGENT_INIT_STATE:
            return { 
                ...state, 
                getAgentLoading: false,
                getAgentSuccess: false,
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
                getAgentSuccess: true,
                getAgentErrors: null, 
            };
        }
        case GET_AGENT_FAILED:
            return { 
                ...state,
                getAgentLoading: false,
                getAgentSuccess: false,
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

export default Agents;