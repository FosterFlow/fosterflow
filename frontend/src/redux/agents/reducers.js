import {
    AGENT_INIT,

    SET_ACTIVE_AGENT,
    SET_ACTIVE_AGENT_INIT_STATE,
    SET_ACTIVE_AGENT_SUCCESS,
    SET_ACTIVE_AGENT_FAILED,

    GET_AGENTS,
    GET_AGENTS_INIT_STATE,
    GET_AGENTS_SUCCESS,
    GET_AGENTS_FAILED,

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
    //current ML model
    activeAgentId: config.BASE_MODEL_AGENT_ID,
    activeAgent: null,

    agents: [],
    //Agent, that represents authorized user, currently it's only one
    userAgent: null,

    setActiveAgentLoading: false,
    setActiveAgentSucess: false,
    setActiveAgentErrors: null,

    getAgentsLoading: false,
    getAgentsSucess: false,
    getAgentsErrors: null,

    getUserAgentLoading: false,
    getUserAgentSucess: false,
    getUserAgentErrors: null,

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

/**TODO: rename to singular */
const Agents = (state = INIT_STATE, action) => {
    switch (action.type) {
        case AGENT_INIT:
            return INIT_STATE;

        case GET_AGENTS:
            return { 
                ...state, 
                getAgentsLoading: true,
                getAgentsSucess: false,
                getAgentsErrors: null, 
        }

        case GET_AGENTS_INIT_STATE:
            return { 
                ...state,
                agents: [], 
                getAgentsLoading: false,
                getAgentsSucess: false,
                getAgentsErrors: null, 
            }
        
        case GET_AGENTS_SUCCESS: {
            //We take only NLP models
            const filteredAgents = action.payload.filter(agent => 
                agent.is_active && agent.nlp_model !== null
            );
            
            return { 
                ...state, 
                agents: filteredAgents,
                getAgentsLoading: false,
                getAgentsSuccess: true, // Noticed a typo here (Sucess -> Success)
                getAgentsErrors: null, 
            };
        }

        case GET_AGENTS_FAILED:
            return { 
                ...state,
                getAgentsLoading: false,
                getAgentsSucess: false,
                getAgentsErrors: action.payload, 
            };

        //Setting default AI agent of the current chat, who will answer us
        case SET_ACTIVE_AGENT:
            return { 
                ...state, 
                activeAgentId: action.payload,
                setActiveAgentLoading: false,
                setActiveAgentSucess: false,
                setActiveAgentErrors: null,
        }

        case SET_ACTIVE_AGENT_INIT_STATE:
            return { 
                ...state, 
                activeAgentId: 0,
                activeAgent: null,
                setActiveAgentLoading: false,
                setActiveAgentSucess: false,
                setActiveAgentErrors: null,
        }

        case SET_ACTIVE_AGENT_SUCCESS:
            return { 
                ...state, 
                activeAgent: action.payload,
                setActiveAgentLoading: false,
                setActiveAgentSucess: false,
                setActiveAgentErrors: null,
        }

        case SET_ACTIVE_AGENT_FAILED:
            return { 
                ...state, 
                setActiveAgentLoading: false,
                setActiveAgentSucess: false,
                setActiveAgentErrors: action.payload,
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
                userAgent: null, 
                getUserAgentLoading: false,
                getUserAgentSucess: false,
                getUserAgentErrors: null, 
            }
            
        case GET_USER_AGENTS_SUCCESS: {
            return { 
                ...state, 
                userAgent: action.payload[0],
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