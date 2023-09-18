import { store } from '../redux/store';
import { 
  accessTokenUpdate,
} from '../redux/auth/actions';
import { 
  addWebSocketRequest,
  clearWebSocketsApiRequestsQueue,
  wsConnection
} from '../redux/webSocket/actions';
import jwtDecode from 'jwt-decode';
import config from '../config';

/**
 * Checks if access token is expired
 */
function isTokenExpired (accessToken) {
  if (accessToken) {
      const decoded = jwtDecode(accessToken);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
          return true;
      }

      return false;
  }

  return true;
};

/**
 * Function checks that accesss token is valid and resolve the queue of web sockets requests
 */
function resolveWebSocketsQueue() {
  const state = store.getState();
  const accessTokenLoading = state.Auth.accessTokenUpdateLoading; 
  
  if (accessTokenLoading){
    return;
  }

  const accessToken = state.Auth.accessToken;
  if (isTokenExpired(accessToken)) {
    store.dispatch(accessTokenUpdate());
    return;
  }

  const wsConnectionLoading = state.WebSocket.wsConnectionLoading;
  if (wsConnectionLoading) {
    return;
  }

  let wsConnectionInstance = wsConnection.state.WebSocket;
  if (wsConnectionInstance === null) {
    wsConnection = new WebSocket(
      config.WS_URL
      + '?access='
      + accessToken
  );
    store.dispatch(wsConnection(wsConnectionInstance));
    return;
  }

  const webSocketsRequestsQueue = state.WebSocket.webSocketsRequestsQueue;
  if (webSocketsRequestsQueue.length > 0 ) {
    webSocketsRequestsQueue.forEach(({ method, sendType, data}) => {
      wsConnectionInstance.send({
        ...data,
        send_type: sendType
      });
    });
    store.dispatch(clearWebSocketsApiRequestsQueue());
  }
}

/**
 * Using this method I'm trying to solve an issue when app makes a few requests 
 * same time, but access token was already expired. And axios makes a few requests for access token update.
 * 
 * Solution: add all incoming reuqets to a queue. Check access token, if it was expired - 
 * request an update, once token is  updated - resolve all reuests from the queue. 
 * 
 * @param {String} method send or resolve
 * @param {String} sendType for example "chat"
 * @param {Object} data 
 * @param {Function} responseHandler
 * @param {Function} errorHandler
 * 
  * 
 * @returns {Object} returns promise 
 */
function webSocketManager (method, sendType, data, responseHandler, errorHandler) {
  //  We use "resolve" method when we get updated access Token.
  //  Listening store seems to be more complex into helper.
  if (method === "resolve") {
    resolveWebSocketsQueue();
    return;
  }

  store.dispatch(addWebSocketRequest({sendType, data, responseHandler, errorHandler}));
  resolveWebSocketsQueue();
}

const webSocketsAuthorizedClient = {
  send: (sendType, data, responseHandler, errorHandler) => webSocketManager("send", sendType, data, responseHandler, errorHandler),
  //  We use "resolve" method when we get updated access Token.
  //  Listening store seems to be more complex into helper.
  resolve: () => webSocketManager("resolve")
};

export default webSocketsAuthorizedClient;