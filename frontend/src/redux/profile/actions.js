import {
    GET_PROFILE,
    GET_PROFILE_SUCCESS,
    GET_PROFILE_FAILED,
    UPDATE_PROFILE_DATA,
    UPDATE_PROFILE_DATA_SUCCESS,
    HIDE_PROFILE_DATA_SUCCESS_MESSAGE,
    UPDATE_PROFILE_DATA_FAILED,
    UPDATE_PROFILE_AVATAR,
    UPDATE_PROFILE_AVATAR_SUCCESS,
    HIDE_PROFILE_AVATAR_SUCCESS_MESSAGE,
    UPDATE_PROFILE_AVATAR_FAILED
} from './constants';

export const getProfile = (id) => ({
    type: GET_PROFILE,
    payload: { id }
});

export const getProfileSuccess = (profile) => ({
    type: GET_PROFILE_SUCCESS,
    payload: profile
});

export const getProfileFailed = (error) => ({
    type: GET_PROFILE_FAILED,
    payload: error
});

export const updateProfileData = (id, data) => ({
    type: UPDATE_PROFILE_DATA,
    payload: { id, data }
});

export const updateProfileDataSuccess = (profile) => ({
    type: UPDATE_PROFILE_DATA_SUCCESS,
    payload: profile
});

export const hideProfileDataSuccessMessage = () => ({
    type: HIDE_PROFILE_DATA_SUCCESS_MESSAGE,
});

export const updateProfileDataFailed = (error) => ({
    type: UPDATE_PROFILE_DATA_FAILED,
    payload: error
});

export const updateProfileAvatar = (id, avatar) => ({
    type: UPDATE_PROFILE_AVATAR,
    payload: { id, avatar }
});

export const updateProfileAvatarSuccess = (avatar) => ({
    type: UPDATE_PROFILE_AVATAR_SUCCESS,
    payload: avatar
});

export const hideProfileAvatarSuccessMessage = () => ({
    type: HIDE_PROFILE_AVATAR_SUCCESS_MESSAGE
});

export const updateProfileAvatarFailed = (error) => ({
    type: UPDATE_PROFILE_AVATAR_FAILED,
    payload: error
});