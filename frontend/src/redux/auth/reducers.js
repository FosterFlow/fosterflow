import {
    LOGIN_USER,
    LOGIN_USER_SUCCESS,
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
    RESET_PASSWORD_CONFIRM,
    RESET_PASSWORD_CONFIRM_SUCCESS,
    VALIDATE_RESET_TOKEN,
    VALIDATE_RESET_TOKEN_SUCCESS,
    SEND_CONFIRMATION_EMAIL,
    SEND_CONFIRMATION_EMAIL_SUCCESS,
    REFRESH_TOKEN_UPDATE,
    REFRESH_TOKEN_UPDATE_SUCCESS,
    REFRESH_TOKEN_UPDATE_FAILURE,
    ADD_AUTHENTICATED_API_REQUEST,
    CLEAR_AUTHENTICATED_API_REQUESTS_QUEUE,
    CHANGE_PASSWORD,
    CHANGE_PASSWORD_SUCCESS,
    CHANGE_PASSWORD_FAILED
} from './constants';

const isAuthenticated = localStorage.getItem("isAuthenticated");
const INIT_STATE = {
    accessToken: undefined,
    loading: false,
    error: null,
    confirmationEmailSent: false,
    isAuthenticated: JSON.parse(isAuthenticated ) || false,
    refreshTokenLoading: false,
    authenticatedApiRequestsQueue: []
};


const Auth = (state = INIT_STATE, action) => {
    console.log("reducers", "Auth", "action", action);
    switch (action.type) {
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
        
        case LOGIN_USER:
            return { ...state, loading: true };
        
        case LOGIN_USER_SUCCESS:
            return { 
                ...state,
                isAuthenticated: true,
                accessToken: action.payload,
                loading: false,
                error: null
            };

        case REGISTER_USER:
            return { ...state, loading: true };

        case REGISTER_USER_SUCCESS:
            return { 
                ...state,
                isAuthenticated: true,
                accessToken: action.payload,
                loading: false,
                error: null
            };

        case LOGOUT_USER:
            return { 
                ...state,
                isAuthenticated: false,
                user: null,
                loading: true
            };

        case LOGOUT_USER_SUCCESS:
            return { 
                ...state,
                accessToken: undefined,
                refreshTokenLoading: false,
                authenticatedApiRequestsQueue: [],
                loading: false,
            };

        case LOGOUT_USER_FAILED:
            return { 
                accessToken: undefined,
                refreshTokenLoading: false,
                authenticatedApiRequestsQueue: [],
                loading: false,
                error: action.payload
            };

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
            
        case CHANGE_PASSWORD:
            return { ...state, loading: true };
    
        case CHANGE_PASSWORD_SUCCESS:
            return { ...state, loading: false };

        case CHANGE_PASSWORD_FAILED:
            return { ...state, error: action.payload };

        case VALIDATE_RESET_TOKEN:
            return { ...state, loading: true, resetTokenValidationStatus: false };

        case VALIDATE_RESET_TOKEN_SUCCESS:
            return { ...state, loading: false, resetTokenValidationStatus: true };

        default: return { ...state };
    }
}

export default Auth;