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

    WS_RECEIVE_MESSAGE_CHUNK,
} from './constants';

const INIT_STATE = {
    webSocketsRequestsQueue: [],

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
                
        /**
        * TODO:
        * Add to a buffer chunks with "start" and "process" status.
        * And write them to the global messages store when we get "done" status.
        * The issue is how to show them correctly then into the right order.
        * 
        * TODO:    
        * Add handling of statuses for "start" and "done"   
        * 
        */
        // case WS_RECEIVE_MESSAGE_CHUNK:
        //     {
        //         const receivedMessage = action.payload;
        //         const messagesList = [...state.messages];
                
        //         // Find the message by its id
        //         const messageIndex = messagesList.findIndex(message => message.id === receivedMessage.id);
                
        //         // If the message already exists, update its content
        //         if (messageIndex !== -1) {
        //             const existingMessage = messagesList[messageIndex];
        //             existingMessage.message_text += receivedMessage.message_chunk;
        //             messagesList[messageIndex] = existingMessage;
        //         } else {
        //             // If the message doesn't exist, simply add it to the list
        //             if (receivedMessage.message_chunk !== undefined) {
        //                 receivedMessage.message_text = receivedMessage.message_chunk;
        //             }
        //             messagesList.push(receivedMessage);
        //         }
                
        //         return {
        //             ...state,
        //             messages: messagesList
        //         };
        //     }

        default: return { ...state };
    }
}

export default WebSocket;