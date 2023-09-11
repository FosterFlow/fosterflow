import { store } from '../redux/store';
import { 
  accessTokenUpdate,
  addAuthenticatedApiRequest,
  clearAuthenticatedApiRequestsQueue
} from '../redux/auth/actions';
import jwtDecode from 'jwt-decode';
import axios from 'axios';
import config from '../config';


// Create a basic instance
const apiClient = axios.create({
  baseURL: config.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

apiClient.interceptors.response.use(
  response => response.data ? response.data : response,
  error => {
    const errorsData = (error.response && error.response.data && error.response.data.errors) || null;
    
    if (errorsData !== null) {
      return Promise.reject(errorsData);
    }
    
    if (error.message) {
      return Promise.reject(error.message);
    }
    
    return Promise.reject("Something wrong.");
  }
);

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

function getAccessTokenFromAxios() {
  const authHeader = apiClient.defaults.headers['Authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.split(' ')[1];
  }
  return ""; 
}

/**
 * Function checks that accesss token is valid and resolve the queue of requests
 */
function resolveRequestsQueue() {
  const state = store.getState();
  const refreshTokenLoading = state.Auth.accessTokenUpdateLoading; 
  
  if (refreshTokenLoading){
    return;
  }

  const accessToken = state.Auth.accessToken;
  if (isTokenExpired(accessToken)) {
    store.dispatch(accessTokenUpdate());
    return;
  }

  const axiosAccessToken = getAccessTokenFromAxios();
  if (accessToken !== axiosAccessToken) {
    apiClient.defaults.headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const apiRequestsQueue = state.Auth.authenticatedApiRequestsQueue;
  if (apiRequestsQueue.length > 0 ) {
    apiRequestsQueue.forEach(({ method, url, data, config, resolve, reject }) => {
      if (typeof config === "undefined") {
        config = {}
      }
      apiClient.request({ method, url, data, ...config }) 
          .then(resolve)
          .catch(reject);
    });
    store.dispatch(clearAuthenticatedApiRequestsQueue());
  }
}

/**
 * Using this method I'm trying to solve an issue when app makes a few requests 
 * same time, but access token was already expired. And axios makes a few requests for refresh token update.
 * 
 * Solution: add all incoming reuqets to a queue. Check access token, if it was expired - 
 * request an update, once token is  updated - resolve all reuests from the queue. 
 * 
 * @param {string} method post,get, delete, update ...
 * @param {string} url  
 * @param {Object} data
 * @param {Object} config additional config that requires for the specific request. 
 * For example: {headers: {'Content-Type': 'multipart/form-data'}}
 * 
 * @returns {Object} returns promise 
 */
function apiRequestsManager (method, url, data, config) {
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
  requestPromise.config = config;

  store.dispatch(addAuthenticatedApiRequest(requestPromise));
  resolveRequestsQueue();

  return requestPromise;
}

const apiAuthorizedClient = {
  post: (url, data, config) => apiRequestsManager("post", url, data, config),
  get: (url, data, config) => apiRequestsManager("get", url, data, config),
  delete: (url, data, config) => apiRequestsManager("delete", url, data, config),
  head: (url, data, config) => apiRequestsManager("head", url, data, config),
  options: (url, data, config) => apiRequestsManager("options", url, data, config),
  put: (url, data, config) => apiRequestsManager("put", url, data, config),
  patch: (url, data, config) => apiRequestsManager("patch", url, data, config),
  //  We use "resolve" method when we get updated access Token.
  //  Listening store seems to be more complex into helper.
  resolve: () => apiRequestsManager("resolve")
};

export default apiAuthorizedClient;