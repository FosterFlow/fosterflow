import jwtDecode from 'jwt-decode';
import config from './../config';
import { configureStore } from '../redux/store';

const API_URL = config.API_URL;

/**
 * Checks if user is authenticated. 
 */
const isUserAuthenticated = () => {
    const state = configureStore.getState();
    const accessToken = state.Auth.accessToken;

    if (accessToken && !isTokenExpired(accessToken)) {
        return true;
    }

    return false;
};

/**
 * Checks if access token is expired
 */
const isTokenExpired = (accessToken) => {
    if (accessToken) {
        const decoded = jwtDecode(accessToken);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
            return true;
        }
    }

    return false;
};

export { isUserAuthenticated, isTokenExpired };