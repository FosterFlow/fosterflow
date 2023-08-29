import {
    GET_AGENT,
    GET_AGENT_SUCCESS,
    GET_AGENT_FAILED,
    UPDATE_AGENT_DATA,
    UPDATE_AGENT_DATA_SUCCESS,
    HIDE_AGENT_DATA_SUCCESS_MESSAGE,
    UPDATE_AGENT_DATA_FAILED,
    UPDATE_AGENT_AVATAR,
    UPDATE_AGENT_AVATAR_SUCCESS,
    HIDE_AGENT_AVATAR_SUCCESS_MESSAGE,
    UPDATE_AGENT_AVATAR_FAILED
} from './constants';
import defaultAvatarImage from  "../../assets/images/users/avatar_default.png";
import config from '../../config';

const INIT_STATE = {
    errors: null,
    loading: false,
    agent: null,
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
        case GET_AGENT:
            return { ...state, loading: true }
        
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
                loading: false, 
                error: null 
            };
        }
        case GET_AGENT_FAILED:
            return { ...state, loading: false, errors: action.payload };
        
        case UPDATE_AGENT_DATA:
            return { 
                ...state,
                agentDataLoading: true,
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

        case HIDE_AGENT_DATA_SUCCESS_MESSAGE:
            return { 
                ...state,
                agentDataSuccess: false
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
        case HIDE_AGENT_AVATAR_SUCCESS_MESSAGE:
            return { 
                ...state, 
                avatarSuccess: false 
            };

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