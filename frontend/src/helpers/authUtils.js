import jwtDecode from 'jwt-decode';
import axios from 'axios';
import config from './../config';

const API_URL = config.API_URL;

/**
 * Checks if user is authenticated. 
 * 
 * Middleware apiAuthorizedClient uses checkAndRefreshToken with each API request. 
 * So if tokens are existing, it means, that user is still authentifcated, if not in method
 * refreshAccessToken we remove them
 */
const isUserAuthenticated = () => {
    const tokens = getTokens();
    if (!tokens) {
        return false;
    }
    
    return true;
}

/**
 * Sets the logged in user
 */
const setTokens = (tokens) => {
    localStorage.setItem('tokens', JSON.stringify(tokens));
}

/**
 * Returns the logged in user
 */
const getTokens = () => {
    const tokens = localStorage.getItem('tokens');
    return tokens ? (typeof (tokens) == 'object' ? tokens : JSON.parse(tokens)) : null;
}

/**
 * Refresh the access token
 * We use API here, because we use it in middleware in ApiAuthorizedClient
 */
const refreshAccessToken = async () => {
    let tokens = getTokens();
    if (tokens && tokens.access) {
        const decoded = jwtDecode(tokens.access);
        const currentTime = Date.now() / 1000;
        if (decoded.exp > currentTime) {
            // Token is still valid, return it
            return tokens.access;
        }
    }

    // Token is not in localStorage or is expired, refresh it
    try {
        const response = await axios.post(`${API_URL}/token/refresh/`, { refresh: tokens.refresh });
        if (response.data && response.data.access) {
            setTokens(response.data); // Save the new token to localStorage
            return response.data.access;
        }
    } catch (error) {
        console.error('Error refreshing access token:', error);
        localStorage.removeItem("tokens");
        throw error;
    }
}

/**
 * Checks if access token is expired and refreshes it if necessary
 */
const checkAndRefreshToken = async () => {
    const tokens = getTokens();
    if (!tokens) {
        throw new Error('User not authenticated');
    }

    try {
        const decoded = jwtDecode(tokens.access);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
            console.warn('Access token expired. Refreshing...');
            const newAccessToken = await refreshAccessToken();
            return newAccessToken;
        } else {
            return tokens.access;
        }
    } catch(error) {
        console.warn('Error decoding token:', error);
        throw error;
    }
}

export { isUserAuthenticated, setTokens, getTokens, refreshAccessToken, checkAndRefreshToken };