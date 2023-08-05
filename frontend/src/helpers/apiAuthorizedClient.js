import axios from 'axios';
import { configureStore } from '../redux/store';
import { setAccessToken, logoutUser } from '../redux/auth/actions';
import { isTokenExpired } from './authUtils';
import config from './../config';

const API_URL = config.API_URL;

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
        const state = configureStore.getState();
        const accessToken = state.Auth.accessToken;

        if (!accessToken || isTokenExpired(accessToken)) {
            // refresh the token
            const response = await axios.post(`${API_URL}/token/refresh/`);
            if (response.data && response.data.access) {
                state.dispatch(setAccessToken(response.data.access));
                config.headers.Authorization = `Bearer ${response.data.access}`;
            }
        } else {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
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