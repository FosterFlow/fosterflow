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

export const initAiAgentProfile = () => ({
    type: AI_AGENT_PROFILE_INIT,
});

export const getAiAgentProfile = (id) => ({
    type: GET_AI_AGENT_PROFILE,
    payload: { id }
});

export const getAiAgentProfileInitState = () => ({
    type: GET_AI_AGENT_PROFILE_INIT_STATE,
});

export const getAiAgentProfileSuccess = (agent) => ({
    type: GET_AI_AGENT_PROFILE_SUCCESS,
    payload: agent
});

export const getAiAgentProfileFailed = (error) => ({
    type: GET_AI_AGENT_PROFILE_FAILED,
    payload: error
});

export const updateAiAgentProfileData = (id, data) => ({
    type: UPDATE_AI_AGENT_PROFILE_DATA,
    payload: { id, data }
});

export const updateAiAgentProfileDataInitState = () => ({
    type: UPDATE_AI_AGENT_PROFILE_DATA_INIT_STATE
});

export const updateAiAgentProfileDataSuccess = (agent) => ({
    type: UPDATE_AI_AGENT_PROFILE_DATA_SUCCESS,
    payload: agent
});

export const updateAiAgentProfileDataFailed = (errors) => ({
    type: UPDATE_AI_AGENT_PROFILE_DATA_FAILED,
    payload: errors
});

export const updateAiAgentProfileAvatar = (id, avatar) => ({
    type: UPDATE_AI_AGENT_PROFILE_AVATAR,
    payload: { id, avatar }
});

export const updateAiAgentProfileAvatarInitState = () => ({
    type: UPDATE_AI_AGENT_PROFILE_AVATAR_INIT_STATE,
});

export const updateAiAgentProfileAvatarSuccess = (avatar) => ({
    type: UPDATE_AI_AGENT_PROFILE_AVATAR_SUCCESS,
    payload: avatar
});

export const updateAiAgentProfileAvatarFailed = (error) => ({
    type: UPDATE_AI_AGENT_PROFILE_AVATAR_FAILED,
    payload: error
});