import {
    LOGIN_USER,
    LOGIN_USER_INIT_STATE,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAILURE,

    LOGOUT_USER,
    LOGOUT_FORCE,
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

    ACCESS_TOKEN_UPDATE,
    ACCESS_TOKEN_UPDATE_INIT_STATE,
    ACCESS_TOKEN_UPDATE_SUCCESS,
    ACCESS_TOKEN_UPDATE_FAILURE,

    ADD_AUTHENTICATED_API_REQUEST,
    CLEAR_AUTHENTICATED_API_REQUESTS_QUEUE,
} from './constants';

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

    resetPasswordLoading: false,
    resetPasswordSuccess: false,
    resetPasswordErrors: null,

    changePasswordLoading: false,
    changePasswordSuccess: false,
    changePassswordErrors: null,

    accessTokenUpdateLoading: false,
    accessTokenUpdateSuccess: false,
    accessTokenUpdateErrors: null,
    
    isAuthenticated: JSON.parse(
        localStorage.getItem("isAuthenticated")
        ) || false,
    authenticatedApiRequestsQueue: []
};


const Auth = (state = INIT_STATE, action) => {
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
        
        case LOGIN_USER_SUCCESS: {
            localStorage.setItem("isAuthenticated", true);

            return { 
                ...state,
                isAuthenticated: true,
                accessToken: action.payload,
                loginLoading: false,
                loginSuccess: true,
                loginErrors: null, 
            };
        }

        case LOGIN_USER_FAILURE:
            return { 
                ...state,
                isAuthenticated: false,
                loginLoading: false,
                loginSuccess: false,
                loginErrors: action.payload, 
            };

        case LOGOUT_USER: {
            return { 
                ...state,
                logoutLoading: true,
                logoutSuccess: false,
                logoutErrors: null,
            };
        }
           
        case LOGOUT_FORCE: {
            localStorage.setItem("isAuthenticated", false);

            return { 
                ...state,
                accessToken: undefined,
                isAuthenticated: false,
                accessTokenLoading: false,
                logoutLoading: true,
                logoutSuccess: false,
                logoutErrors: null,
                authenticatedApiRequestsQueue: []
            };
        }

        case LOGOUT_USER_INIT_STATE:
            return { 
                ...state,
                logoutLoading: false,
                logoutSuccess: false,
                logoutErrors: null,
            };
    
        case LOGOUT_USER_SUCCESS: {
            localStorage.setItem("isAuthenticated", false);

            return { 
                ...state,
                accessToken: undefined,
                isAuthenticated: false,
                accessTokenLoading: false,
                logoutLoading: true,
                logoutSuccess: false,
                logoutErrors: null,
                authenticatedApiRequestsQueue: []
            };
        }

        case LOGOUT_USER_FAILURE: {
            localStorage.setItem("isAuthenticated", false);
            
            return {
                ...state, 
                accessToken: undefined,
                isAuthenticated: false,
                accessTokenLoading: false,
                authenticatedApiRequestsQueue: [],
                logoutLoading: false,
                logoutSuccess: false,
                logoutErrors: action.payload,
            };
        }

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
        
        case REGISTER_USER_SUCCESS: {
            //we store isAuthenticated param into Local Storage for the case if user reloaded the page
            localStorage.setItem("isAuthenticated", true);

            return { 
                ...state,
                isAuthenticated: true,
                accessToken: action.payload,
                registerLoading: false,
                registerSuccess: true,
                registerErrors: null,
            };
        }
        
        case REGISTER_USER_FAILURE:
            return { 
                ...state,
                isAuthenticated: false,
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
                resetPasswordLoading: true,
                resetPasswordSuccess: false,
                resetPasswordErrors: null,
            };

        case RESET_PASSWORD_INIT_STATE:
            return { 
                ...state, 
                resetPasswordLoading: false,
                resetPasswordSuccess: false,
                resetPasswordErrors: null,
            };
    
        case RESET_PASSWORD_SUCCESS:
            return { 
                ...state, 
                resetPasswordLoading: false,
                resetPasswordSuccess: true,
                resetPasswordErrors: null,
            };

        case RESET_PASSWORD_FAILURE:
            return { 
                ...state, 
                resetPasswordLoading: false,
                resetPasswordSuccess: false,
                resetPasswordErrors: action.payload,
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
        
        case ACCESS_TOKEN_UPDATE:
            return { 
                ...state,
                accessTokenUpdateLoading: true,
                accessTokenUpdateSuccess: false,
                accessTokenUpdateErrors: null,
            };

        case ACCESS_TOKEN_UPDATE_INIT_STATE:
            return { 
                ...state,
                accessTokenUpdateLoading: false,
                accessTokenUpdateSuccess: false,
                accessTokenUpdateErrors: null,
            };
        
        case ACCESS_TOKEN_UPDATE_SUCCESS:
            return { 
                ...state, 
                accessToken: action.payload,
                accessTokenUpdateLoading: false,
                accessTokenUpdateSuccess: true,
                accessTokenUpdateErrors: null, 
            };

        case ACCESS_TOKEN_UPDATE_FAILURE:
            return { 
                ...state,
                accessTokenUpdateLoading: false,
                accessTokenUpdateSuccess: false,
                accessTokenUpdateErrors: action.payload, 
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