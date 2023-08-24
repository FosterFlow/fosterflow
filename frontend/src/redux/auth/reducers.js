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

    RESET_PASSWORD,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_FAILURE,

    VALIDATE_PASSWORD_RESET_TOKEN,
    VALIDATE_PASSWORD_RESET_TOKEN_SUCCESS,
    VALIDATE_PASSWORD_RESET_TOKEN_FAILURE,

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

    validatePasswordResetTokenLoading: false,
    validatePasswordResetTokenSuccess: false,
    validatePasswordResetTokenErrors: null,

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

        case FORGET_PASSWORD:
            return { 
                ...state, 
                forgetPasswordLoading: true,
                forgetPasswordSuccess: false,
                forgetPasswordErrors: null,
            };
    
        case FORGET_PASSWORD_SUCCESS:
            return { 
                ...state, 
                forgetPasswordLoading: false,
                forgetPasswordSuccess: true,
                forgetPasswordErrors: null, 
            };

        case FORGET_PASSWORD_FAILURE:
            return { 
                ...state, 
                forgetPasswordLoading: false,
                forgetPasswordSuccess: false,
                forgetPasswordErrors: action.payload, 
            };

        case CONFIRM_EMAIL:
            return { 
                ...state, 
                confirmEmailLoading: true,
                confirmEmailSuccess: false,
                confirmEmailErrors: null,
            }; 
    
        case CONFIRM_EMAIL_SUCCESS:
            return { 
                ...state, 
                confirmEmailLoading: false,
                confirmEmailSuccess: true,
                confirmEmailErrors: null,
            };
            
        case CONFIRM_EMAIL_FAILURE:
            return { 
                ...state, 
                confirmEmailLoading: false,
                confirmEmailSuccess: false,
                confirmEmailErrors: action.payload,
            };

        case RESET_PASSWORD:
            return { 
                ...state, 
                resetPaswordLoading: true,
                resetPaswordSuccess: false,
                resetPaswordErrors: null,
            };
    
        case RESET_PASSWORD_SUCCESS:
            return { 
                ...state, 
                resetPaswordLoading: false,
                resetPaswordSuccess: false,
                resetPaswordErrors: null,
            };

        case RESET_PASSWORD_FAILURE:
            return { 
                ...state, 
                resetPaswordLoading: false,
                resetPaswordSuccess: false,
                resetPaswordErrors: action.payload,
            };

        case VALIDATE_PASSWORD_RESET_TOKEN:
            return { 
                ...state, 
                validatePasswordResetTokenLoading: true,
                validatePasswordResetTokenSuccess: false,
                validatePasswordResetTokenErrors: null, 
            };
    
        case VALIDATE_PASSWORD_RESET_TOKEN_SUCCESS:
            return { 
                ...state, 
                validatePasswordResetTokenLoading: false,
                validatePasswordResetTokenSuccess: true,
                validatePasswordResetTokenErrors: null,
            };

        case VALIDATE_PASSWORD_RESET_TOKEN_FAILURE:
            return { 
                ...state, 
                validatePasswordResetTokenLoading: false,
                validatePasswordResetTokenSuccess: false,
                validatePasswordResetTokenErrors: action.payload,
            };
        
        case REFRESH_TOKEN_UPDATE:
            return { 
                ...state,
                refreshTokenUpdateLoading: true,
                refreshTokenUpdateSuccess: false,
                refreshTokenUpdateErrors: null,
            };
        
        case REFRESH_TOKEN_UPDATE_SUCCESS:
            return { 
                ...state, 
                accessToken: action.payload,
                refreshTokenUpdateLoading: false,
                refreshTokenUpdateSuccess: true,
                refreshTokenUpdateErrors: null, 
            };

        case REFRESH_TOKEN_UPDATE_FAILURE:
            return { 
                ...state,
                refreshTokenUpdateLoading: false,
                refreshTokenUpdateSuccess: false,
                refreshTokenUpdateErrors: action.payload, 
                authenticatedApiRequestsQueue: []
            };


        case ADD_AUTHENTICATED_API_REQUEST:
            return { 
                ...state,
                authenticatedApiRequestsQueue : [...state.authenticatedApiRequestsQueue, action.payload]
            };

        case CLEAR_AUTHENTICATED_API_REQUESTS_QUEUE:
            return { ...state, authenticatedApiRequestsQueue: [] };
        
        

        
    

        

        

        case AUTH_FAILED:
            return { 
                ...state, 
                isAuthenticated: false, 
                accessToken: undefined, 
                user: null, 
                loading: false, 
                error: action.payload 
            };
        
        

        case SEND_CONFIRMATION_EMAIL:
            return { ...state, loading: true, confirmationEmailSent: false }; 

        case SEND_CONFIRMATION_EMAIL_SUCCESS:
            return { ...state, loading: false, confirmationEmailSent: true }; 

        
            
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

        

        default: return { ...state };
    }
}

export default Auth;