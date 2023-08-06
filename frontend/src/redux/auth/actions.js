import {
    LOGIN_USER,
    LOGIN_USER_SUCCESS,
    LOGOUT_USER,
    LOGOUT_USER_SUCCESS,
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
    SET_ACCESS_TOKEN,
    DELETE_ACCESS_TOKEN
} from './constants';

export const setAccessToken = (accessToken) => {
    return {
        type: SET_ACCESS_TOKEN,
        payload: { accessToken }
    }
};

export const deleteAccessToken = () => {
    return {
        type: DELETE_ACCESS_TOKEN,
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