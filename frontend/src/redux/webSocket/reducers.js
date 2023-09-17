import _ from 'lodash';
import {
    ADD_WEB_SOCKET_REQUEST,
    CLEAR_WEB_SOCKET_REQUESTS_QUEUE,
 
    WS_CONNECTION,
    WS_CONNECTION_KILL,
    WS_CONNECTION_SUCCESS,
    WS_CONNECTION_FAILED,
    WS_CONNECTION_CLOSED,

} from './constants';

const INIT_STATE = {
    webSocketsRequestsQueue: [],

    wsConnection: null,
    wsConnectionLoading: null,
    wsConnectionSuccess: false,
    wsConnectionErrors: null,
};

const WebSocket = (state = INIT_STATE, action) => {
    switch (action.type) {
        case ADD_WEB_SOCKET_REQUEST:
            return { 
                ...state,
                webSocketsRequestsQueue : [...state.webSocketsRequestsQueue, action.payload]
            };
    
        case CLEAR_WEB_SOCKET_REQUESTS_QUEUE:
            return { 
                ...state, 
                webSocketsRequestsQueue: [] 
            };

        case WS_CONNECTION:
            return {
                ...state,
                wsConnection: null,
                wsConnectionLoading: true,
                wsConnectionSuccess: false,
                wsConnectionErrors: null,
            };

        case WS_CONNECTION_KILL:
            return {
                ...state,
                wsConnection: null,
                wsConnectionLoading: false,
                wsConnectionSuccess: false,
                wsConnectionErrors: null,
            };

        case WS_CONNECTION_SUCCESS: {
            return {
                ...state,
                wsConnection: action.payload,
                wsConnectionLoading: false,
                wsConnectionSuccess: true,
                wsConnectionErrors: null,
            };
        }
            
        case WS_CONNECTION_FAILED:
            return {
                ...state,
                wsConnection: action.payload,
                wsConnectionLoading: false,
                wsConnectionSuccess: true,
                wsConnectionErrors: null,
            };

        case WS_CONNECTION_CLOSED:
            return {
                ...state,
                wsConnection: null,
                wsConnectionLoading: false,
                wsConnectionSuccess: true,
                wsConnectionErrors: null,
            };

        default: return { ...state };
    }
}

export default WebSocket;