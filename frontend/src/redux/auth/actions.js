import {
    LOGIN_USER,
    LOGIN_USER_INIT_STATE,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAILURE,

    LOGOUT_USER,
    LOGOUT_USER_INIT_STATE,
    LOGOUT_USER_SUCCESS,
    LOGOUT_USER_FAILURE,

    REGISTER_USER,
    REGISTER_USER_INIT_STATE,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_FAILURE,

    SEND_CONFIRMATION_EMAIL,
    SEND_CONFIRMATION_EMAIL_INIT_STATE,
    SEND_CONFIRMATION_EMAIL_SUCCESS,
    SEND_CONFIRMATION_EMAIL_FAILURE,

    CONFIRM_EMAIL,
    CONFIRM_EMAIL_INIT_STATE,
    CONFIRM_EMAIL_SUCCESS,
    CONFIRM_EMAIL_FAILURE,

    FORGET_PASSWORD,
    FORGET_PASSWORD_INIT_STATE,
    FORGET_PASSWORD_SUCCESS,
    FORGET_PASSWORD_FAILURE,

    VALIDATE_PASSWORD_RESET_TOKEN,
    VALIDATE_PASSWORD_RESET_TOKEN_INIT_STATE,
    VALIDATE_PASSWORD_RESET_TOKEN_SUCCESS,
    VALIDATE_PASSWORD_RESET_TOKEN_FAILURE,

    RESET_PASSWORD,
    RESET_PASSWORD_INIT_STATE,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_FAILURE,

    CHANGE_PASSWORD,
    CHANGE_PASSWORD_INIT_STATE,
    CHANGE_PASSWORD_SUCCESS,
    CHANGE_PASSWORD_FAILURE,

    REFRESH_TOKEN_UPDATE,
    REFRESH_TOKEN_UPDATE_INIT_STATE,
    REFRESH_TOKEN_UPDATE_SUCCESS,
    REFRESH_TOKEN_UPDATE_FAILURE,

    ADD_AUTHENTICATED_API_REQUEST,
    CLEAR_AUTHENTICATED_API_REQUESTS_QUEUE,
  
    ADD_WEB_SOCKET_REQUEST,
    CLEAR_WEB_SOCKET_REQUESTS_QUEUE
} from './constants';

export const loginUser = (email, password ) => {
    return {
        type: LOGIN_USER,
        payload: { email, password }
    }
};

export const loginUserInitState = () => {
    return {
        type: LOGIN_USER_INIT_STATE
    }
};

export const loginUserSuccess = (accessToken) => {
    console.log('Actions', 'loginUserSuccess', 'accessToken', accessToken);   
    return {
        type: LOGIN_USER_SUCCESS,
        payload: accessToken
    }
};

export const loginUserFailure = (errors) => {
    return {
        type: LOGIN_USER_FAILURE,
        payload: errors
    }
};


export const logoutUser = () => {
    return {
        type: LOGOUT_USER
    }
};

export const logoutUserInitState = () => {
    return {
        type: LOGOUT_USER_INIT_STATE
    }
};

export const logoutUserSuccess = () => {
    return {
      type: LOGOUT_USER_SUCCESS
    };
};

export const logoutUserFailure = (errors) => {
    return {
      type: LOGOUT_USER_FAILURE,
      payload: errors
    };
};

export const registerUser = (email, password ) => {
    console.log('Actions', 'registerUser', 'email, password ', email, password );
    return {
        type: REGISTER_USER,
        payload: { email, password }
    }
};

export const registerUserInitState = () => {
    return {
        type: REGISTER_USER_INIT_STATE,
    }
};

export const registerUserSuccess = (user) => ({
    type: REGISTER_USER_SUCCESS,
    payload: user
});

export const registerUserFailure = (errors) => ({
    type: REGISTER_USER_FAILURE,
    payload: errors
});

export const sendConfirmationEmail = () => ({
    type: SEND_CONFIRMATION_EMAIL,
});

export const sendConfirmationEmailInitState = () => ({
    type: SEND_CONFIRMATION_EMAIL_INIT_STATE,
});
  
export const sendConfirmationEmailSuccess = () => ({
    type: SEND_CONFIRMATION_EMAIL_SUCCESS
});

export const sendConfirmationEmailFailure = (errors) => ({
    type: SEND_CONFIRMATION_EMAIL_FAILURE,
    payload: errors
});

export const confirmEmail = (token) => {
    return {
        type: CONFIRM_EMAIL,
        payload: { token }
    }
};

export const confirmEmailInitState = () => ({
    type: CONFIRM_EMAIL_INIT_STATE,
});
  
export const confirmEmailSuccess = () => ({
    type: CONFIRM_EMAIL_SUCCESS
});

export const confirmEmailFailure = (errors) => ({
    type: CONFIRM_EMAIL_FAILURE,
    payload: errors
});

export const forgetPassword = (email) => ({
    type: FORGET_PASSWORD,
    payload: { email }
});

export const forgetPasswordInitState = () => ({
    type: FORGET_PASSWORD_INIT_STATE,
});

export const forgetPasswordSuccess = (passwordResetStatus) => ({
    type: FORGET_PASSWORD_SUCCESS,
    payload: passwordResetStatus
});

export const forgetPasswordFailure = (errors) => ({
    type: FORGET_PASSWORD_FAILURE,
    payload: errors
});

export const validatePasswordResetToken = (token) => ({
    type: VALIDATE_PASSWORD_RESET_TOKEN,
    payload: { token }
});

export const validatePasswordResetTokenInitState = () => ({
    type: VALIDATE_PASSWORD_RESET_TOKEN_INIT_STATE
});

export const validatePasswordResetTokenSuccess = () => ({
    type: VALIDATE_PASSWORD_RESET_TOKEN_SUCCESS
});

export const validatePasswordResetTokenFailure = (errors) => ({
    type: VALIDATE_PASSWORD_RESET_TOKEN_FAILURE,
    paylod: errors
});

export const resetPassword = (password, token) => ({
    type: RESET_PASSWORD,
    payload: { password, token }
});

export const resetPasswordInitState = () => ({
    type: RESET_PASSWORD_INIT_STATE
});

export const resetPasswordSuccess = () => ({
    type: RESET_PASSWORD_SUCCESS
});

export const resetPasswordFailure = (errors) => ({
    type: RESET_PASSWORD_FAILURE,
    payload: errors
});

export const changePassword = (oldPassword, newPassword) => {
    return {
        type: CHANGE_PASSWORD,
        payload: {oldPassword, newPassword}
    }
};

export const changePasswordInitState = () => {
    return {
        type: CHANGE_PASSWORD_INIT_STATE,
    }
};

export const changePasswordSuccess = () => {
    return {
        type: CHANGE_PASSWORD_SUCCESS,
    }
};

export const changePasswordFailure = (errors) => {
    return {
        type: CHANGE_PASSWORD_FAILURE,
        payload: errors
    }
};

export const refreshTokenUpdate = () => {
    return {
        type: REFRESH_TOKEN_UPDATE,
    }
};

export const refreshTokenUpdateInitState = () => {
    return {
        type: REFRESH_TOKEN_UPDATE_INIT_STATE,
    }
};

export const refreshTokenUpdateSuccess = (accessToken) => {
    return {
        type: REFRESH_TOKEN_UPDATE_SUCCESS,
        payload: accessToken
    }
};

export const refreshTokenUpdateFailure = (errors) => {
    return {
        type: REFRESH_TOKEN_UPDATE_FAILURE,
        payload: errors
    }
};

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