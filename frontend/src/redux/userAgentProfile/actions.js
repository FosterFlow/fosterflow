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

export const initUserAgentProfile = () => ({
    type: USER_AGENT_PROFILE_INIT,
});

export const getUserAgentProfile = (id) => ({
    type: GET_USER_AGENT_PROFILE,
    payload: { id }
});

export const getUserAgentProfileInitState = () => ({
    type: GET_USER_AGENT_PROFILE_INIT_STATE,
});

export const getUserAgentProfileSuccess = (agent) => ({
    type: GET_USER_AGENT_PROFILE_SUCCESS,
    payload: agent
});

export const getUserAgentProfileFailed = (error) => ({
    type: GET_USER_AGENT_PROFILE_FAILED,
    payload: error
});

export const updateUserAgentProfileData = (id, data) => ({
    type: UPDATE_USER_AGENT_PROFILE_DATA,
    payload: { id, data }
});

export const updateUserAgentProfileDataInitState = () => ({
    type: UPDATE_USER_AGENT_PROFILE_DATA_INIT_STATE
});

export const updateUserAgentProfileDataSuccess = (agent) => ({
    type: UPDATE_USER_AGENT_PROFILE_DATA_SUCCESS,
    payload: agent
});

export const updateUserAgentProfileDataFailed = (errors) => ({
    type: UPDATE_USER_AGENT_PROFILE_DATA_FAILED,
    payload: errors
});

export const updateUserAgentProfileAvatar = (id, avatar) => ({
    type: UPDATE_USER_AGENT_PROFILE_AVATAR,
    payload: { id, avatar }
});

export const updateUserAgentProfileAvatarInitState = () => ({
    type: UPDATE_USER_AGENT_PROFILE_AVATAR_INIT_STATE,
});

export const updateUserAgentProfileAvatarSuccess = (avatar) => ({
    type: UPDATE_USER_AGENT_PROFILE_AVATAR_SUCCESS,
    payload: avatar
});

export const updateUserAgentProfileAvatarFailed = (error) => ({
    type: UPDATE_USER_AGENT_PROFILE_AVATAR_FAILED,
    payload: error
});