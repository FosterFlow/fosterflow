import { call, put, takeEvery, delay } from 'redux-saga/effects';
import apiClient from '../../helpers/apiClient';
import apiAuthorizedClient from '../../helpers/apiAuthorizedClient';
import webSocketsAuthorizedClient from '../../helpers/webSocketsAuthorizedClient';

import {
    LOGIN_USER,
    LOGOUT_USER,
    REGISTER_USER,
    SEND_CONFIRMATION_EMAIL,
    CONFIRM_EMAIL,
    FORGET_PASSWORD,
    VALIDATE_PASSWORD_RESET_TOKEN,
    RESET_PASSWORD,
    CHANGE_PASSWORD,
    ACCESS_TOKEN_UPDATE
} from './constants';


import {
    loginUserSuccess,
    loginUserFailure,
    
    logoutForce,
    logoutUserSuccess,
    logoutUserFailure,

    registerUserSuccess,
    registerUserFailure,
    
    sendConfirmationEmailInitState,
    sendConfirmationEmailSuccess,
    sendConfirmationEmailFailure,
    
    confirmEmailInitState,
    confirmEmailSuccess,
    confirmEmailFailure,
    
    forgetPasswordInitState,
    forgetPasswordSuccess,
    forgetPasswordFailure,
    
    validatePasswordResetTokenInitState,
    validatePasswordResetTokenSuccess,
    validatePasswordResetTokenFailure,
    
    resetPasswordSuccess,
    resetPasswordFailure,
    
    changePasswordInitState,
    changePasswordSuccess,
    changePasswordFailure,
    
    accessTokenUpdateInitState,
    accessTokenUpdateSuccess,
    accessTokenUpdateFailure,
} from './actions';

import {
    killWsConnection,
    clearWebSocketsApiRequestsQueue
} from '../webSocket/actions';

import {
    chatInit
} from '../chat/actions';

import {
    agentInit 
} from '../agent/actions';

import {
    userInit
} from '../user/actions';
    

/**
 * Login the user
 * @param {*} payload - email and password 
 */
function* loginUserSaga({ payload: { email, password } }) {
    yield put(accessTokenUpdateInitState());
    try {
        const response = yield call(apiClient.post, '/token/', { email, password });
        yield put(loginUserSuccess(response.access));
        yield call(webSocketsAuthorizedClient.resolve);
    } catch (errors) {
        yield put(loginUserFailure(errors));
    }
}


/**
 * Logout the user
 */
function* logoutSaga() {
    try {
        yield put(killWsConnection());
        yield put (clearWebSocketsApiRequestsQueue());
        yield put(chatInit());
        yield put(userInit());
        yield put(agentInit());
        yield call(apiAuthorizedClient.post, '/logout/');
        //Time for showing loader, otherwise page 
        yield delay(1000);
        yield put(logoutUserSuccess());
    } catch (errors) {
        yield delay(1000);
        yield put(logoutUserFailure(errors));
    }
}

/**
 * Register the user
 */
function* registerSaga({ payload: { email, password } }) {
    try {
        const response = yield call(apiClient.post, '/register/', { email, password });
        yield put(registerUserSuccess(response.access));
    } catch (errors) {
        yield put(registerUserFailure(errors));
    }
}

  /**
 * Send a link with confirmation email
 */
  function* sendConfirmationEmailSaga() {
    try {
        yield put(confirmEmailInitState());
        yield call(apiAuthorizedClient.post, '/confirmation-email/send/');
        yield delay(1000); //show loading in case if API response is too fast
        yield put(sendConfirmationEmailSuccess());
        yield delay(5000);
        yield put(sendConfirmationEmailInitState());
    } catch (errors) {
        yield put(sendConfirmationEmailFailure(errors));
        yield delay(15000);
        yield put(sendConfirmationEmailInitState());
    }
  }

/**
 * Confirm the email
 */
function* confirmEmailSaga({ payload: { token } }) {
    try {
        yield call(apiClient.post, '/confirmation-email/confirm/', { email_confirm_token: token });
        yield delay(1000); //show loading in case if API response is too fast
        yield put(confirmEmailSuccess());
        yield delay(5000);
        yield put(confirmEmailInitState());
    } catch (errors) {
        yield put(confirmEmailFailure(errors));
    }
  }


/**
 * forget password
 */
function* forgetPasswordSaga({ payload: { email } }) {
    try {
        const response = yield call(apiClient.post, '/password-reset/', { email });
        yield delay(1000); //show loading in case if API response is too fast
        yield put(forgetPasswordSuccess(response.status));
        yield delay(5000);
        yield put(forgetPasswordInitState());
    } catch (errors) {
        yield put(forgetPasswordFailure(errors));
    }
}

function* validatePasswordResetTokenSaga({ payload: { token } }) {
    try {
        yield call(apiClient.post, '/password-reset/validate_token/', { token });
        yield delay(1000); //show loading in case if API response is too fast
        yield put(validatePasswordResetTokenSuccess());
        yield delay(5000);
        yield put(validatePasswordResetTokenInitState());
    } catch (errors) {
        yield put(validatePasswordResetTokenFailure(errors));
        yield delay(15000);
        yield put(validatePasswordResetTokenInitState());
    }
}

function* resetPasswordSaga({ payload: { password, token } }) {
    try {
        yield call(apiClient.post, '/password-reset/confirm/', { password, token });
        yield put(resetPasswordSuccess());
    } catch (errors) {
        yield put(resetPasswordFailure(errors));
    }
}

function* changePasswordSaga({ payload: { oldPassword, newPassword } }) {
    try {
        const response = yield call(
            apiAuthorizedClient.put,
            '/change-password/', 
            { 
                old_password: oldPassword, 
                new_password: newPassword 
            });
        yield put(changePasswordSuccess(response.message));
        yield delay(5000);
        yield put(changePasswordInitState());
    } catch (errors) {
        yield put(changePasswordFailure(errors));
    }
}


function* accessTokenUpdateSaga() {
    try {
        const response = yield call(apiClient.post, '/token/refresh/');
        yield put(accessTokenUpdateSuccess(response.access));
        yield call(apiAuthorizedClient.resolve);
        yield call(webSocketsAuthorizedClient.resolve);
    } catch (errors) {
        yield put(accessTokenUpdateFailure(errors));
        yield put(logoutForce());
        yield delay(10000);
        yield put(accessTokenUpdateInitState());
    }
}

export default function* chatSaga() {
    yield takeEvery(LOGIN_USER, loginUserSaga);
    yield takeEvery(LOGOUT_USER, logoutSaga);
    yield takeEvery(REGISTER_USER, registerSaga);
    yield takeEvery(SEND_CONFIRMATION_EMAIL, sendConfirmationEmailSaga);
    yield takeEvery(CONFIRM_EMAIL, confirmEmailSaga);
    yield takeEvery(FORGET_PASSWORD, forgetPasswordSaga);
    yield takeEvery(VALIDATE_PASSWORD_RESET_TOKEN, validatePasswordResetTokenSaga);
    yield takeEvery(RESET_PASSWORD, resetPasswordSaga);
    yield takeEvery(CHANGE_PASSWORD, changePasswordSaga);
    yield takeEvery(ACCESS_TOKEN_UPDATE, accessTokenUpdateSaga);
}