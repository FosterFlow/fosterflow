// helpers/apiAuthorizedClient.js

import axios from 'axios';
import { checkAndRefreshToken } from './authUtils';
import config from './../config';

// Create an authorized instance
const apiAuthorizedClient = axios.create({
  baseURL: config.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// This interceptor updates the Authorization header before a request is sent
apiAuthorizedClient.interceptors.request.use(async config => {
    try {
        const accessToken = await checkAndRefreshToken();
        config.headers.Authorization = `Bearer ${accessToken}`;
      } catch (error) {
        // handle the error
        console.error('An error occurred:', error);        
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