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

    CONFIRM_EMAIL,
    CONFIRM_EMAIL_SUCCESS,
    CONFIRM_EMAIL_FAILURE,

    RESET_PASSWORD_CONFIRM,
    RESET_PASSWORD_CONFIRM_SUCCESS,
    ESET_PASSWORD_CONFIRM_FAILURE,

    VALIDATE_RESET_TOKEN,
    VALIDATE_RESET_TOKEN_SUCCESS,
    VALIDATE_RESET_TOKEN_FAILURE,

    SEND_CONFIRMATION_EMAIL,
    SEND_CONFIRMATION_EMAIL_SUCCESS,
    SEND_CONFIRMATION_EMAIL_FAILURE,

    REFRESH_TOKEN_UPDATE,
    REFRESH_TOKEN_UPDATE_SUCCESS,
    REFRESH_TOKEN_UPDATE_FAILURE,

    ADD_AUTHENTICATED_API_REQUEST,
    CLEAR_AUTHENTICATED_API_REQUESTS_QUEUE,
    
    CHANGE_PASSWORD,
    CHANGE_PASSWORD_SUCCESS,
    CHANGE_PASSWORD_FAILURE,
    
    HIDE_CHANGE_PASSWORD_SUCCESS_MESSAGE,
    CHANGE_PASSWORD_FAILED
} from './constants';

const isAuthenticated = localStorage.getItem("isAuthenticated");
const INIT_STATE = {
    accessToken: undefined,
    
    loginLoading: false,
    loginSuccess: false,
    loginErrors: null,
    
    logoutLoading: false,
    logoutSuccess: false,
    logoutErrors: null,

    registerLoading: false,
    registerSuccess: false,
    registerErrors: null,

    forgetPasswordLoading: false,
    forgetPasswordSuccess: false,
    forgetPasswordErrors: null,

    confirmEmailLoading: false,
    confirmEmailSuccess: false,
    confirmEmailErrors: null,

    resetPaswordLoading: false,
    resetPaswordSuccess: false,
    resetPaswordErrors: null,

    validateResetTokenLoading: false,
    validateResetTokenSuccess: false,
    validateResetTokenErrors: null,

    sendConfirmationEmailLoading: false,
    sendConfirmationEmailSuccess: false,
    sendConfirmationEmailErrors: null,

    refreshTokenUpdateLoading: false,
    refreshTokenUpdateSuccess: false,
    refreshTokenUpdateErrors: null,

    changePasswordLoading: false,
    changePassswordErrors: null,
    changePasswordSuccess: false,
    
    isAuthenticated: JSON.parse(isAuthenticated ) || false,
    authenticatedApiRequestsQueue: [],
};


const Auth = (state = INIT_STATE, action) => {
    console.log("reducers", "Auth", "action", action);
    switch (action.type) {
        case LOGIN_USER:
            return { 
                ...state,
                loginLoading: true,
                loginSuccess: false,
                loginErrors: null, 
            };
        
        case LOGIN_USER_SUCCESS:
            return { 
                ...state,
                isAuthenticated: true,
                accessToken: action.payload,
                loginLoading: false,
                loginSuccess: true,
                loginErrors: null, 
            };

        case LOGIN_USER_FAILURE:
            return { 
                ...state,
                isAuthenticated: false,
                loginLoading: false,
                loginSuccess: false,
                loginErrors: action.payload, 
            };

        case LOGOUT_USER:
            return { 
                ...state,
                isAuthenticated: false,
                user: null,
                logoutLoading: true,
                logoutSuccess: false,
                logoutErrors: null,
            };
    
        case LOGOUT_USER_SUCCESS:
            return { 
                ...state,
                accessToken: undefined,
                refreshTokenLoading: false,
                authenticatedApiRequestsQueue: [],
                logoutLoading: false,
                logoutSuccess: true,
                logoutErrors: null,
            };
    
        case LOGOUT_USER_FAILURE:
            return { 
                accessToken: undefined,
                refreshTokenLoading: false,
                authenticatedApiRequestsQueue: [],
                logoutLoading: false,
                logoutSuccess: false,
                logoutErrors: action.payload,
            };

        case REGISTER_USER:
            return { 
                ...state,
                registerLoading: true,
                registerSuccess: false,
                registerErrors: null,
            };
        
        case REGISTER_USER_SUCCESS:
            return { 
                ...state,
                isAuthenticated: true,
                accessToken: action.payload,
                registerLoading: false,
                registerSuccess: true,
                registerErrors: null,
            };
        
        case REGISTER_USER_FAILURE:
            return { 
                ...state,
                isAuthenticated: true,
                accessToken: undefined,
                registerLoading: false,
                registerSuccess: false,
                registerErrors: action.payload,
            };
        
        
        case REFRESH_TOKEN_UPDATE:
            return { ...state, refreshTokenLoading: true };
        
        case REFRESH_TOKEN_UPDATE_SUCCESS:
            return { ...state, refreshTokenLoading: false, accessToken: action.payload };

        case REFRESH_TOKEN_UPDATE_FAILURE:
            return { 
                ...state,
                refreshTokenLoading: false,
                error: action.payload,
                authenticatedApiRequestsQueue: []
            };

        case ADD_AUTHENTICATED_API_REQUEST:
            return { 
                ...state,
                authenticatedApiRequestsQueue : [...state.authenticatedApiRequestsQueue, action.payload]
            };

        case CLEAR_AUTHENTICATED_API_REQUESTS_QUEUE:
            return { ...state, authenticatedApiRequestsQueue: [] };
        
        

        
    

        

        case FORGET_PASSWORD:
            return { ...state, loading: true };

        case FORGET_PASSWORD_SUCCESS:
            return { 
                ...state, 
                passwordResetStatus: action.payload,
                loading: false,
                error: null 
            };

        case AUTH_FAILED:
            return { 
                ...state, 
                isAuthenticated: false, 
                accessToken: undefined, 
                user: null, 
                loading: false, 
                error: action.payload 
            };
        
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
            
        case CHANGE_PASSWORD:
            return { 
                ...state, 
                changePassswordErrors: null, 
                changePasswordLoading: true,
                changePasswordSuccess: false 
            };
    
        case CHANGE_PASSWORD_SUCCESS:
            return { 
                ...state,
                changePassswordErrors: null,
                changePasswordLoading: false,
                changePasswordSuccess: true 
            };

        case HIDE_CHANGE_PASSWORD_SUCCESS_MESSAGE:
            return { 
                ...state,
                loading: false,
                changePasswordSuccess: false 
            };

        case CHANGE_PASSWORD_FAILED:
            return { 
                ...state,
                changePassswordErrors: action.payload,
                changePasswordLoading: false,
                changePasswordSuccess: false  
            };

        case VALIDATE_RESET_TOKEN:
            return { ...state, loading: true, resetTokenValidationStatus: false };

        case VALIDATE_RESET_TOKEN_SUCCESS:
            return { ...state, loading: false, resetTokenValidationStatus: true };

        default: return { ...state };
    }
}

export default Auth;