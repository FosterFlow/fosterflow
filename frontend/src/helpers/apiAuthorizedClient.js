import axios from 'axios';
import { store } from '../redux/store';
import { setAccessToken, logoutUser } from '../redux/auth/actions';
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
  }

  return false;
};

// Create an authorized instance
const apiAuthorizedClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// This interceptor updates the Authorization header before a request is sent
apiAuthorizedClient.interceptors.request.use(async config => {
    try {
        const state = store.getState();
        let accessToken = state.Auth.accessToken;

        if (!accessToken || isTokenExpired(accessToken)) {
            //we keep post request here, implementing updating access token through
            //redux, actions, saga might be too complicated
            const response = await axios.post(`${API_URL}/token/refresh/`);
            if (response && response.access) {
              accessToken = response.access;
              state.dispatch(setAccessToken(accessToken));
            }
        } 
        
        config.headers.Authorization = `Bearer ${accessToken}`;
    } catch (error) {
        // handle the error
        console.error('An error occurred:', error);
        logoutUser();
    }
    return config;
});

// Response interceptor remains the same as your original code
apiAuthorizedClient.interceptors.response.use(
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

export default apiAuthorizedClient;