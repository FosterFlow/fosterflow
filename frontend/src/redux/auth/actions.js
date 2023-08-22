import {
    LOGIN_USER,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAILED,
    LOGOUT_USER,
    LOGOUT_USER_SUCCESS,
    LOGOUT_USER_FAILED,
    REGISTER_USER,
    REGISTER_USER_SUCCESS,
    FORGET_PASSWORD,
    FORGET_PASSWORD_SUCCESS,
    AUTH_FAILED,
    CONFIRM_EMAIL,
    CONFIRM_EMAIL_SUCCESS,
    SEND_CONFIRMATION_EMAIL,
    SEND_CONFIRMATION_EMAIL_SUCCESS,
    RESET_PASSWORD_CONFIRM,
    RESET_PASSWORD_CONFIRM_SUCCESS,
    VALIDATE_RESET_TOKEN,
    VALIDATE_RESET_TOKEN_SUCCESS,
    REFRESH_TOKEN_UPDATE,
    REFRESH_TOKEN_UPDATE_SUCCESS,
    REFRESH_TOKEN_UPDATE_FAILURE,
    ADD_AUTHENTICATED_API_REQUEST,
    CLEAR_AUTHENTICATED_API_REQUESTS_QUEUE,
    CHANGE_PASSWORD,
    CHANGE_PASSWORD_SUCCESS,
    HIDE_CHANGE_PASSWORD_SUCCESS_MESSAGE,
    CHANGE_PASSWORD_FAILED,
    ADD_WEB_SOCKET_REQUEST,
    CLEAR_WEB_SOCKET_REQUESTS_QUEUE
} from './constants';

export const changePassword = (oldPassword, newPassword) => {
    return {
        type: CHANGE_PASSWORD,
        payload: {oldPassword, newPassword}
    }
};

export const changePasswordSuccess = () => {
    return {
        type: CHANGE_PASSWORD_SUCCESS,
    }
};

export const hideChangePasswordSuccessMessage = () => {
    return {
        type: HIDE_CHANGE_PASSWORD_SUCCESS_MESSAGE,
    }
};

export const changePasswordFailed = (errors) => {
    return {
        type: CHANGE_PASSWORD_FAILED,
        payload: errors
    }
};

export const refreshTokenUpdate = () => {
    return {
        type: REFRESH_TOKEN_UPDATE,
    }
};

export const refreshTokenUpdateSuccess = (accessToken) => {
    return {
        type: REFRESH_TOKEN_UPDATE_SUCCESS,
        payload: accessToken
    }
};

export const refreshTokenUpdateFailure = (error) => {
    return {
        type: REFRESH_TOKEN_UPDATE_FAILURE,
        payload: error
    }
};

export const loginUser = (email, password ) => {
    console.log('Actions', 'loginUser', 'email, password ', email, password );
    return {
        type: LOGIN_USER,
        payload: { email, password }
    }
};

export const loginUserSuccess = (accessToken) => {
    console.log('Actions', 'loginUserSuccess', 'accessToken', accessToken);   
    return {
        type: LOGIN_USER_SUCCESS,
        payload: accessToken
    }
};

export const loginUserFailed = (errors) => {
    return {
        type: LOGIN_USER_FAILED,
        payload: errors
    }
};

export const registerUser = (email, password ) => {
    console.log('Actions', 'registerUser', 'email, password ', email, password );
    return {
        type: REGISTER_USER,
        payload: { email, password }
    }
};

export const registerUserSuccess = (user) => ({
    type: REGISTER_USER_SUCCESS,
    payload: user
});

export const logoutUser = (history) => {
    return {
        type: LOGOUT_USER,
        payload: { history }
    }
};

export const logoutUserSuccess = () => {
    return {
      type: LOGOUT_USER_SUCCESS
    };
};

export const logoutUserFailed = () => {
    return {
      type: LOGOUT_USER_FAILED
    };
};

export const forgetPassword = (email) => ({
    type: FORGET_PASSWORD,
    payload: { email }
});

export const forgetPasswordSuccess = (passwordResetStatus) => ({
    type: FORGET_PASSWORD_SUCCESS,
    payload: passwordResetStatus
});

export const authError = (error) => {
    console.log("Auth action authError error ", error);
    return {
        type: AUTH_FAILED,
        payload: error
    }
};

export const confirmEmail = (token) => ({
    type: CONFIRM_EMAIL,
    payload: { token }
});
  
export const confirmEmailSuccess = () => ({
    type: CONFIRM_EMAIL_SUCCESS
});

export const sendConfirmationEmail = () => ({
    type: SEND_CONFIRMATION_EMAIL,
});
  
export const sendConfirmationEmailSuccess = () => ({
    type: SEND_CONFIRMATION_EMAIL_SUCCESS
});

export const resetPasswordConfirm = (password, token) => ({
    type: RESET_PASSWORD_CONFIRM,
    payload: { password, token }
});

export const resetPasswordConfirmSuccess = () => ({
    type: RESET_PASSWORD_CONFIRM_SUCCESS
});

export const validateResetToken = (token) => ({
    type: VALIDATE_RESET_TOKEN,
    payload: { token }
});

export const validateResetTokenSuccess = () => ({
    type: VALIDATE_RESET_TOKEN_SUCCESS
});

export const addAuthenticatedApiRequest = (requestPromise) => ({
    type: ADD_AUTHENTICATED_API_REQUEST,
    payload: requestPromise
});

export const clearAuthenticatedApiRequestsQueue = () => ({
    type: CLEAR_AUTHENTICATED_API_REQUESTS_QUEUE
});

export const addWebSocketRequest = (requestPromise) => ({
    type: ADD_WEB_SOCKET_REQUEST,
    payload: requestPromise
});

export const clearWebSocketsApiRequestsQueue = () => ({
    type: CLEAR_WEB_SOCKET_REQUESTS_QUEUE
});