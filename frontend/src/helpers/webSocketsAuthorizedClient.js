import { store } from '../redux/store';
import { 
  accessTokenUpdate,
} from '../redux/auth/actions';
import { 
  accessTokenUpdate,
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

  let wsConnection = wsConnection.state.WebSocket;
  if (wsConnection === null) {
    wsConnection = new WebSocket(
      config.WS_URL
      + url
      + '?access='
      + accessToken
  );
    store.dispatch(wsConnection(wsConnection));
    return;
  }

  const webSocketsRequestsQueue = state.Auth.webSocketsRequestsQueue;
  if (webSocketsRequestsQueue.length > 0 ) {
    webSocketsRequestsQueue.forEach(({ method, url, resolve }) => {
        resolve(webSocketConnection);
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
 * @param {string} method new web socket connection or resolve
 * @param {string} url
  * 
 * @returns {Object} returns promise 
 */
function webSocketManager (method, url) {
let resolve;
  
  //  We use "resolve" method when we get updated access Token.
  //  Listening store seems to be more complex into helper.
  if (method === "resolve") {
    resolveWebSocketsQueue();
    return;
  }

  const requestPromise = new Promise ((_resolve) =>{
    resolve = _resolve;
  });

  requestPromise.resolve = resolve;
  requestPromise.method = method;
  requestPromise.url = url;

  store.dispatch(addWebSocketRequest(requestPromise));
  resolveWebSocketsQueue();

  return requestPromise;
}

const webSocketsAuthorizedClient = {
  sendChatMessage: () => webSocketManager("send", sendType, message),
  //  We use "resolve" method when we get updated access Token.
  //  Listening store seems to be more complex into helper.
  resolve: () => webSocketManager("resolve")
};

export default webSocketsAuthorizedClient;