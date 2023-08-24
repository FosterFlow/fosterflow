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

    sendConfirmationEmailLoading: false,
    sendConfirmationEmailSuccess: false,
    sendConfirmationEmailErrors: null,

    confirmEmailLoading: false,
    confirmEmailSuccess: false,
    confirmEmailErrors: null,

    forgetPasswordLoading: false,
    forgetPasswordSuccess: false,
    forgetPasswordErrors: null,

    validatePasswordResetTokenLoading: false,
    validatePasswordResetTokenSuccess: false,
    validatePasswordResetTokenErrors: null,

    resetPaswordLoading: false,
    resetPaswordSuccess: false,
    resetPaswordErrors: null,

    changePasswordLoading: false,
    changePasswordSuccess: false,
    changePassswordErrors: null,

    refreshTokenUpdateLoading: false,
    refreshTokenUpdateSuccess: false,
    refreshTokenUpdateErrors: null,
    
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

        case LOGIN_USER_INIT_STATE:
            return { 
                ...state,
                loginLoading: false,
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

        case LOGOUT_USER_INIT_STATE:
            return { 
                ...state,
                logoutLoading: false,
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

        case REGISTER_USER_INIT_STATE:
            return { 
                ...state,
                registerLoading: false,
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

        case SEND_CONFIRMATION_EMAIL:
            return { 
                ...state, 
                sendConfirmationEmailLoading: true,
                sendConfirmationEmailSuccess: false,
                sendConfirmationEmailErrors: null,
            };
            
        case SEND_CONFIRMATION_EMAIL_INIT_STATE:
            return { 
                ...state, 
                sendConfirmationEmailLoading: false,
                sendConfirmationEmailSuccess: false,
                sendConfirmationEmailErrors: null,
            }; 
    
        case SEND_CONFIRMATION_EMAIL_SUCCESS:
            return { 
                ...state, 
                sendConfirmationEmailLoading: false,
                sendConfirmationEmailSuccess: true,
                sendConfirmationEmailErrors: null,
            };

        case SEND_CONFIRMATION_EMAIL_FAILURE:
            return { 
                ...state, 
                sendConfirmationEmailLoading: false,
                sendConfirmationEmailSuccess: false,
                sendConfirmationEmailErrors: action.payload,
            };

        case CONFIRM_EMAIL:
            return { 
                ...state, 
                confirmEmailLoading: true,
                confirmEmailSuccess: false,
                confirmEmailErrors: null,
            }; 

        case CONFIRM_EMAIL_INIT_STATE:
            return { 
                ...state, 
                confirmEmailLoading: false,
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

        case FORGET_PASSWORD:
            return { 
                ...state, 
                forgetPasswordLoading: true,
                forgetPasswordSuccess: false,
                forgetPasswordErrors: null,
            };

        case FORGET_PASSWORD_INIT_STATE:
            return { 
                ...state, 
                forgetPasswordLoading: false,
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
    
        case VALIDATE_PASSWORD_RESET_TOKEN:
            return { 
                ...state, 
                validatePasswordResetTokenLoading: true,
                validatePasswordResetTokenSuccess: false,
                validatePasswordResetTokenErrors: null, 
            };

        case VALIDATE_PASSWORD_RESET_TOKEN_INIT_STATE:
            return { 
                ...state, 
                validatePasswordResetTokenLoading: false,
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
        
        case RESET_PASSWORD:
            return { 
                ...state, 
                resetPaswordLoading: true,
                resetPaswordSuccess: false,
                resetPaswordErrors: null,
            };

        case RESET_PASSWORD_INIT_STATE:
            return { 
                ...state, 
                resetPaswordLoading: false,
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

        case CHANGE_PASSWORD:
            return { 
                ...state, 
                changePasswordLoading: true,
                changePasswordSuccess: false,
                changePassswordErrors: null,
            };
        
        case CHANGE_PASSWORD_INIT_STATE:
            return { 
                ...state,
                changePasswordLoading: false,
                changePasswordSuccess: false,
                changePassswordErrors: null,
            };
        
        case CHANGE_PASSWORD_SUCCESS:
            return { 
                ...state,
                changePasswordLoading: false,
                changePasswordSuccess: true,
                changePassswordErrors: null,
            };
    
        case CHANGE_PASSWORD_FAILURE:
            return { 
                ...state,
                changePasswordLoading: false,
                changePasswordSuccess: false,
                changePassswordErrors: action.payload,
            };
        
        case REFRESH_TOKEN_UPDATE:
            return { 
                ...state,
                refreshTokenUpdateLoading: true,
                refreshTokenUpdateSuccess: false,
                refreshTokenUpdateErrors: null,
            };

        case REFRESH_TOKEN_UPDATE_INIT_STATE:
            return { 
                ...state,
                refreshTokenUpdateLoading: false,
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
            return { 
                ...state, 
                authenticatedApiRequestsQueue: [] 
            };

        default: return { ...state };
    }
}

export default Auth;