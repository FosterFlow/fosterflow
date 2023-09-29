import _ from 'lodash';
import {
    ADD_WEB_SOCKET_REQUEST,
    CLEAR_WEB_SOCKET_REQUESTS_QUEUE,
 
    WS_CONNECTION,
    WS_CONNECTION_KILL,
    WS_CONNECTION_SUCCESS,
    WS_CONNECTION_FAILED,
    WS_CONNECTION_CLOSED,

    WS_SEND,
    WS_SEND_INIT_STATE,
    WS_SEND_SUCCESS,
    WS_SEND_FAILED,
} from './constants';

import {
    receiveMessageChunk,
    receiveMessageChunkFailed
  } from '../chat/actions';

const INIT_STATE = {
    webSocketsRequestsQueue: [],
    //Handlers for onmessage/onerror events for different WebSocket types ("type" field) of messages 
    webSocketsResponseHandlers: {
        "chat_message_chunk": {
            onMessage: receiveMessageChunk,
            onError: receiveMessageChunkFailed
        }
    },

    wsConnection: null,
    wsConnectionLoading: null,
    wsConnectionSuccess: false,
    wsConnectionErrors: null,

    wsMessageSendLoading: false,
    wsMessageSendSuccess: false,
    wsMessageSendErrors: null,
};

const WebSocket = (state = INIT_STATE, action) => {
    switch (action.type) {
        case ADD_WEB_SOCKET_REQUEST:
            return { 
                ...state,
                webSocketsRequestsQueue: [...state.webSocketsRequestsQueue, action.payload],
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

        case WS_SEND:
            return {
                ...state,
                wsSendLoading: true,
                wsSendSuccess: false,
                wsSendErrors: null
            };
    
        case WS_SEND_INIT_STATE:
            return {
                ...state,
                wsSendLoading: false,
                wsSendSuccess: false,
                wsSendErrors: null
            };
    
        case WS_SEND_SUCCESS:
            return {
                ...state,
                wsSendLoading: false,
                wsSendSuccess: true,
                wsSendErrors: null
            };
    
        case WS_SEND_FAILED:
            return {
                ...state,
                wsSendLoading: false,
                wsSendSuccess: false,
                wsSendErrors: action.payload
            };

        default: return { ...state };
    }
}

export default WebSocket;