import {
    USER_INIT,
    GET_AUTHORIZED_USER,
    GET_AUTHORIZED_USER_SUCCESS,
    GET_USER,
    GET_USER_SUCCESS,
    UPDATE_USER,
    UPDATE_USER_SUCCESS,
    DELETE_USER,
    USER_FAILED,
    GET_USERS,
    GET_USERS_SUCCESS,
} from './constants';

export const userInit = () => ({
    type: USER_INIT,
});

export const getAuthorizedUser = (data) => ({
    type: GET_AUTHORIZED_USER,
    payload: data
});

export const getAuthorizedUserSuccess = (authorizedUser) => {
    console.log ("user -> actions getUserAuthorizedSuccess authorizedUser", authorizedUser);

    return {
        type: GET_AUTHORIZED_USER_SUCCESS,
        payload: authorizedUser
    };
};

export const getUsers = () => ({
    type: GET_USERS
});

export const getUsersSuccess = (users) => ({
    type: GET_USERS_SUCCESS,
    payload: users
});

export const getUser = (id) => ({
    type: GET_USER,
    payload: { id }
});

export const getUserSuccess = (user) => ({
    type: GET_USER_SUCCESS,
    payload: user
});

export const updateUser = (id, data) => ({
    type: UPDATE_USER,
    payload: { id, data }
});

export const updateUserSuccess = (user) => ({
    type: UPDATE_USER_SUCCESS,
    payload: user
});

export const deleteUser = (id) => ({
    type: DELETE_USER,
    payload: { id }
});

export const userError = (error) => ({
    type: USER_FAILED,
    payload: error
});
