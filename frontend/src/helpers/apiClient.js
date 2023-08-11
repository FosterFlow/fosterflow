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
    return Promise.reject(error.response);
  }
);

export default apiClient;