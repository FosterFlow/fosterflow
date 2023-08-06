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
    RESET_PASSWORD_CONFIRM,
    RESET_PASSWORD_CONFIRM_SUCCESS,
    VALIDATE_RESET_TOKEN,
    VALIDATE_RESET_TOKEN_SUCCESS,
    SEND_CONFIRMATION_EMAIL,
    SEND_CONFIRMATION_EMAIL_SUCCESS,
    SET_ACCESS_TOKEN,
    DELETE_ACCESS_TOKEN
} from './constants';

const INIT_STATE = {
    accessToken: undefined,
    loading: false,
    error: null,
    confirmationEmailSent: false,
    isAuthenticated: localStorage.getItem("isAuthenticated") || false
};


const Auth = (state = INIT_STATE, action) => {
    console.log("reducers", "Auth", "action", action);
    switch (action.type) {
        case SET_ACCESS_TOKEN:
            return { ...state, accessToken: action.payload };
        case DELETE_ACCESS_TOKEN:
            return { ...state, isAuthenticated: false, accessToken: undefined };
        case LOGIN_USER:
            return { ...state, loading: true };
        case LOGIN_USER_SUCCESS:
            return { ...state, isAuthenticated: true, accessToken: action.payload, loading: false, error: null };

        case REGISTER_USER:
            return { ...state, loading: true };

        case REGISTER_USER_SUCCESS:
            return { ...state, isAuthenticated: true, accessToken: action.payload, loading: false, error: null };

        case LOGOUT_USER:
            return { ...state, loading: true };

        case LOGOUT_USER_SUCCESS:
            return { ...state, isAuthenticated: false, user: null, accessToken: undefined, loading: false };

        case FORGET_PASSWORD:
            return { ...state, loading: true };

        case FORGET_PASSWORD_SUCCESS:
            return { ...state, passwordResetStatus: action.payload, loading: false, error: null };

        case AUTH_FAILED:
            return { ...state, isAuthenticated: false, accessToken: undefined, user: null, loading: false, error: action.payload };
        
        case CONFIRM_EMAIL:
            return { ...state, loading: true, emailConfirmed: false }; 

        case CONFIRM_EMAIL_SUCCESS:
            return { ...state, loading: false, emailConfirmed: true }; 

        case SEND_CONFIRMATION_EMAIL:
            return { ...state, loading: true, confirmationEmailSent: false }; 

        case SEND_CONFIRMATION_EMAIL_SUCCESS:
            return { ...state, loading: false, confirmationEmailSent: true }; 

        case RESET_PASSWORD_CONFIRM:
            return { ...state, loading: true, resetPasswordConfirmed: false };

        case RESET_PASSWORD_CONFIRM_SUCCESS:
            return { ...state, loading: false, resetPasswordConfirmed: true }; 

        case VALIDATE_RESET_TOKEN:
            return { ...state, loading: true, resetTokenValidationStatus: false };

        case VALIDATE_RESET_TOKEN_SUCCESS:
            return { ...state, loading: false, resetTokenValidationStatus: true };

        default: return { ...state };
    }
}

export default Auth;