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
    UPDATE_AGENT_AVATAR_FAILED,
} from './constants';

export const agentInit = () => ({
    type: AGENT_INIT,
});

export const getAgent = (id) => ({
    type: GET_AGENT,
    payload: { id }
});

export const getAgentInitState = () => ({
    type: GET_AGENT_INIT_STATE,
});

export const getAgentSuccess = (agent) => ({
    type: GET_AGENT_SUCCESS,
    payload: agent
});

export const getAgentFailed = (error) => ({
    type: GET_AGENT_FAILED,
    payload: error
});

export const updateAgentData = (id, data) => ({
    type: UPDATE_AGENT_DATA,
    payload: { id, data }
});

export const updateAgentDataInitState = () => ({
    type: UPDATE_AGENT_DATA_INIT_STATE
});

export const updateAgentDataSuccess = (agent) => ({
    type: UPDATE_AGENT_DATA_SUCCESS,
    payload: agent
});

export const updateAgentDataFailed = (errors) => ({
    type: UPDATE_AGENT_DATA_FAILED,
    payload: errors
});

export const updateAgentAvatar = (id, avatar) => ({
    type: UPDATE_AGENT_AVATAR,
    payload: { id, avatar }
});

export const updateAgentAvatarInitState = () => ({
    type: UPDATE_AGENT_AVATAR_INIT_STATE,
});

export const updateAgentAvatarSuccess = (avatar) => ({
    type: UPDATE_AGENT_AVATAR_SUCCESS,
    payload: avatar
});

export const updateAgentAvatarFailed = (error) => ({
    type: UPDATE_AGENT_AVATAR_FAILED,
    payload: error
});