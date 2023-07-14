import {
    GET_PROFILE,
    GET_PROFILE_SUCCESS,
    UPDATE_PROFILE,
    UPDATE_PROFILE_SUCCESS,
    DELETE_PROFILE,
    PROFILE_FAILED
} from './constants';

export const getProfile = (id) => ({
    type: GET_PROFILE,
    payload: { id }
});

export const getProfileSuccess = (profile) => ({
    type: GET_PROFILE_SUCCESS,
    payload: profile
});

export const updateProfile = (id, data) => ({
    type: UPDATE_PROFILE,
    payload: { id, data }
});

export const updateProfileSuccess = (profile) => ({
    type: UPDATE_PROFILE_SUCCESS,
    payload: profile
});

export const deleteProfile = (id) => ({
    type: DELETE_PROFILE,
    payload: { id }
});

export const profileError = (error) => ({
    type: PROFILE_FAILED,
    payload: error
});
