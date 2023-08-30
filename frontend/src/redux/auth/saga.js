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
    REFRESH_TOKEN_UPDATE
} from './constants';


import {
    loginUserSuccess,
    loginUserFailure,
    
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
    
    validatePasswordResetTokenSuccess,
    validatePasswordResetTokenFailure,
    validatePasswordResetTokenInitState,
    
    resetPasswordSuccess,
    resetPasswordFailure,
    resetPasswordInitState,
    
    changePasswordSuccess,
    changePasswordFailure,
    changePasswordInitState,
    
    refreshTokenUpdateSuccess,
    refreshTokenUpdateFailure,
} from './actions';

/**
 * Login the user
 * @param {*} payload - email and password 
 */
function* loginUserSaga({ payload: { email, password } }) {
    console.log("redux aux saga", "login", "email, password", email, password );
    try {
        const response = yield call(apiClient.post, '/token/', { email, password });
        console.log("redux aux saga", "login response", response );
        //we store isAuthenticated param into Local Storage for the case if user reloaded the page
        yield localStorage.setItem("isAuthenticated", true);
        yield put(loginUserSuccess(response.access));            
    } catch (errors) {
        yield put(loginUserFailure(errors));
    }
}


/**
 * Logout the user
 */
function* logoutSaga() {
    console.log ("Auth saga logout");
    try {
        //we use isAuthorized param for the case if user reloaded the page
        localStorage.setItem("isAuthenticated", false);
        yield call(apiAuthorizedClient.post, '/logout/');
        yield put(logoutUserSuccess());
    } catch (errors) {
        yield put(logoutUserFailure(errors));
    }
}

/**
 * Register the user
 */
function* registerSaga({ payload: { email, password } }) {
    try {
        const response = yield call(apiClient.post, '/register/', { email, password });
        //we store isAuthenticated param into Local Storage for the case if user reloaded the page
        localStorage.setItem("isAuthenticated", true);
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
        yield call(apiAuthorizedClient.post, '/confirmation-email/send/');
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
        yield put(confirmEmailSuccess());
        yield delay(5000);
        yield put(confirmEmailInitState());
    } catch (errors) {
        yield put(confirmEmailFailure(errors));
        yield delay(15000);
        yield put(confirmEmailInitState());
    }
  }


/**
 * forget password
 */
function* forgetPasswordSaga({ payload: { email } }) {
    try {
        const response = yield call(apiClient.post, '/password-reset/', { email });
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


function* refreshTokenUpdateSaga() {
    try {
        const response = yield call(apiClient.post, '/token/refresh/');
        yield put(refreshTokenUpdateSuccess(response.access));
        yield call(apiAuthorizedClient.resolve);
        yield call(webSocketsAuthorizedClient.resolve);
    } catch (errors) {
        yield put(refreshTokenUpdateFailure(errors));
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
    yield takeEvery(REFRESH_TOKEN_UPDATE, refreshTokenUpdateSaga);
}