import {
    LOGIN_USER,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAILURE,

    LOGOUT_USER,
    LOGOUT_USER_SUCCESS,
    LOGOUT_USER_FAILURE,

    REGISTER_USER,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_FAILURE,

    FORGET_PASSWORD,
    FORGET_PASSWORD_SUCCESS,
    FORGET_PASSWORD_FAILURE,

    AUTH_FAILED,
    CONFIRM_EMAIL,
    CONFIRM_EMAIL_SUCCESS,
    CONFIRM_EMAIL_FAILURE,

    SEND_CONFIRMATION_EMAIL,
    SEND_CONFIRMATION_EMAIL_SUCCESS,
    SEND_CONFIRMATION_EMAIL_FAILURE,

    RESET_PASSWORD,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_FAILURE,

    VALIDATE_PASSWORD_RESET_TOKEN,
    VALIDATE_PASSWORD_RESET_TOKEN_SUCCESS,
    VALIDATE_PASSWORD_RESET_TOKEN_FAILURE,

    REFRESH_TOKEN_UPDATE,
    REFRESH_TOKEN_UPDATE_SUCCESS,
    REFRESH_TOKEN_UPDATE_FAILURE,

    ADD_AUTHENTICATED_API_REQUEST,
    CLEAR_AUTHENTICATED_API_REQUESTS_QUEUE,
    
    CHANGE_PASSWORD,
    CHANGE_PASSWORD_SUCCESS,
    HIDE_CHANGE_PASSWORD_SUCCESS_MESSAGE,
    CHANGE_PASSWORD_FAILURE
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

export const loginUserFailure = (errors) => {
    return {
        type: LOGIN_USER_FAILURE,
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

export const registerUserFailure = (errors) => ({
    type: REGISTER_USER_FAILURE,
    payload: errors
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

export const logoutUserFailure = (errors) => {
    return {
      type: LOGOUT_USER_FAILURE,
      payload: errors
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

export const forgetPasswordFailure = (errors) => ({
    type: FORGET_PASSWORD_FAILURE,
    payload: errors
});

export const confirmEmail = (token) => ({
    type: CONFIRM_EMAIL,
    payload: { token }
});
  
export const confirmEmailSuccess = () => ({
    type: CONFIRM_EMAIL_SUCCESS
});

export const confirmEmailFailure = (errors) => ({
    type: CONFIRM_EMAIL_FAILURE,
    payload: errors
});

export const sendConfirmationEmail = () => ({
    type: SEND_CONFIRMATION_EMAIL,
});
  
export const sendConfirmationEmailSuccess = () => ({
    type: SEND_CONFIRMATION_EMAIL_SUCCESS
});

export const sendConfirmationEmailFailure = (errors) => ({
    type: SEND_CONFIRMATION_EMAIL_FAILURE,
    payload: errors
});

export const resetPassword = (password, token) => ({
    type: RESET_PASSWORD,
    payload: { password, token }
});

export const resetPasswordSuccess = () => ({
    type: RESET_PASSWORD_SUCCESS
});

export const resetPasswordFailure = (errors) => ({
    type: RESET_PASSWORD_FAILURE
});

export const validatePasswordResetToken = (token) => ({
    type: VALIDATE_PASSWORD_RESET_TOKEN,
    payload: { token }
});

export const validatePasswordResetTokenSuccess = () => ({
    type: VALIDATE_PASSWORD_RESET_TOKEN_SUCCESS
});

export const validatePasswordResetTokenFailure = (errors) => ({
    type: VALIDATE_PASSWORD_RESET_TOKEN_FAILURE,
    paylod: errors
});

export const addAuthenticatedApiRequest = (requestPromise) => ({
    type: ADD_AUTHENTICATED_API_REQUEST,
    payload: requestPromise
});

export const clearAuthenticatedApiRequestsQueue = () => ({
    type: CLEAR_AUTHENTICATED_API_REQUESTS_QUEUE
});