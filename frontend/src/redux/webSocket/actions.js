// actions.js
import {
    ADD_WEB_SOCKET_REQUEST,
    CLEAR_WEB_SOCKET_REQUESTS_QUEUE,

    WS_CONNECTION,
    WS_CONNECTION_KILL,
    WS_CONNECTION_SUCCESS,
    WS_CONNECTION_FAILED,
    WS_CONNECTION_CLOSED,
  } from './constants';

export const addWebSocketRequest = (requestPromise) => ({
    type: ADD_WEB_SOCKET_REQUEST,
    payload: requestPromise
});

export const clearWebSocketsApiRequestsQueue = () => ({
    type: CLEAR_WEB_SOCKET_REQUESTS_QUEUE
});

export const wsConnection = () => ({
    type: WS_CONNECTION
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