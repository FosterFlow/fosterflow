// actions.js
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

    WS_RECEIVE_MESSAGE
  } from './constants';

export const addWebSocketRequest = (requestData) => ({
    type: ADD_WEB_SOCKET_REQUEST,
    payload: requestData
});

export const clearWebSocketsApiRequestsQueue = () => ({
    type: CLEAR_WEB_SOCKET_REQUESTS_QUEUE
});

export const wsConnection = (newWebSocket) => ({
    type: WS_CONNECTION,
    payload: newWebSocket
  });

  export const killWsConnection = () => ({
    type: WS_CONNECTION_KILL,
  });
  
  export const wsConnectionSuccess = (socket) => ({
    type: WS_CONNECTION_SUCCESS,
    payload: socket
  });
  
  export const wsConnectionFailed = (errors) => ({
    type: WS_CONNECTION_FAILED,
    payload: errors
  });
  
  export const wsConnectionClosed = () => ({
    type: WS_CONNECTION_CLOSED
  });

  export const wsSend = () => ({
    type: WS_SEND
  });

  export const wsSendInitState = () => ({
    type: WS_SEND_INIT_STATE
  });

  export const wsSendSuccess = () => ({
    type: WS_SEND_SUCCESS
  });
  
  export const wsSendFailed = (errors) => ({
    type: WS_SEND_FAILED,
    payload: errors
  });
  
  export const wsReceiveMessage = (messageChunk) => ({
    type: WS_RECEIVE_MESSAGE,
    payload: messageChunk
  });