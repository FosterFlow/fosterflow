import axios from 'axios';
import { store } from '../redux/store';
import { 
  refreshTokenUpdate,
  addAuthenticatedApiRequest,
  clearAuthenticatedApiRequestsQueue
} from '../redux/auth/actions';
import config from './../config';
import jwtDecode from 'jwt-decode';

const API_URL = config.API_URL;

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

// Create an Axios instance
const apiAxios = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Handling errors
//TODO show errors on the screen
apiAxios.interceptors.response.use(
  response => response.data ? response.data : response,
  async error => {
    let message = '';
    
    switch (error.status) {
        case 500: message = 'Internal Server Error'; break;
        case 401: message = 'Invalid credentials'; break;
        case 404: message = "Sorry! the data you are looking for could not be found"; break;
        default: message = error.message || error;
    }
    return Promise.reject(message);
  }
);


/**
 * Function checks that accesss token is valid and resolve the queue of requests
 */
function resolveRequestsQueue() {
  const state = store.getState();
  const refreshTokenLoading = state.Auth.refreshTokenLoading; 
  
  if (refreshTokenLoading){
    return;
  }

  const accessToken = state.Auth.accessToken;
  if (isTokenExpired(accessToken)) {
    store.dispatch(refreshTokenUpdate());
    return;
  }

  //Specify valid accessToken
  apiAxios.interceptors.request.use(async config => {
    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  });

  const apiRequestsQueue = state.Auth.authenticatedApiRequestsQueue;
  if (apiRequestsQueue.length > 0 ) {
    apiRequestsQueue.forEach(({ method, url, data, resolve, reject }) => {
      apiAxios.request({ method, url, data })
        .then(resolve)
        .catch(reject);
    });
    store.dispatch(clearAuthenticatedApiRequestsQueue());
  }
}

/**
 * Using this method I'm trying to solve an issue when app makes a few requests 
 * same time and access token was already expired.
 * 
 * Solution: add all incoming reuqets to a queue. Check access token, if it was expired - 
 * request an update, one token is  updated - resolve all reuests from the queue. * 
 * 
 * @param {string} method post,get, delete, update ...
 * @param {string} url  
 * @param {Object} data
 * 
 * @returns {Object} returns promise 
 */
function apiRequestsManager (method, url, data) {
  let resolve, reject;
  
  //  We use "resolve" method when we get updated access Token.
  //  Listening store seems to be more complex into helper.
  if (method === "resolve") {
    resolveRequestsQueue();
    return;
  }

  const requestPromise = new Promise ((_resolve, _reject) =>{
    resolve = _resolve;
    reject = _reject;
  });

  requestPromise.resolve = resolve;
  requestPromise.reject = reject;
  requestPromise.method = method;
  requestPromise.url = url;
  requestPromise.data = data;

  store.dispatch(addAuthenticatedApiRequest(requestPromise));
  resolveRequestsQueue();

  return requestPromise;
}

const apiAuthorizedClient = {
  post: (url, data) => apiRequestsManager("post", url, data),
  get: (url, data) => apiRequestsManager("get", url, data),
  delete: (url, data) => apiRequestsManager("delete", url, data),
  head: (url, data) => apiRequestsManager("head", url, data),
  options: (url, data) => apiRequestsManager("options", url, data),
  put: (url, data) => apiRequestsManager("put", url, data),
  patch: (url, data) => apiRequestsManager("patch", url, data),
  //  We use "resolve" method when we get updated access Token.
  //  Listening store seems to be more complex into helper.
  resolve: () => apiRequestsManager("resolve")
};

export default apiAuthorizedClient;