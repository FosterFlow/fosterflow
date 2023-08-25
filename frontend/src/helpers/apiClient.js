// helpers/apiClient.js

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

export default apiClient;