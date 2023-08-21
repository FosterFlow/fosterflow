import { all, call, fork, put, takeEvery, delay } from 'redux-saga/effects';
import apiClient from '../../helpers/apiClient';
import apiAuthorizedClient from '../../helpers/apiAuthorizedClient';

import {
    LOGIN_USER,
    LOGOUT_USER,
    REGISTER_USER,
    FORGET_PASSWORD,
    CONFIRM_EMAIL,
    RESET_PASSWORD_CONFIRM,
    VALIDATE_RESET_TOKEN,
    SEND_CONFIRMATION_EMAIL,
    REFRESH_TOKEN_UPDATE,
    CHANGE_PASSWORD
} from './constants';


import {
    loginUserSuccess,
    loginUserFailed,
    registerUserSuccess,
    forgetPasswordSuccess,
    authError,
    logoutUserSuccess,
    logoutUserFailed,
    confirmEmailSuccess,
    resetPasswordConfirmSuccess,
    validateResetTokenSuccess,
    sendConfirmationEmailSuccess,
    refreshTokenUpdateSuccess,
    refreshTokenUpdateFailure,
    changePasswordSuccess,
    hideChangePasswordSuccessMessage,
    changePasswordFailed
} from './actions';

/**
 * Login the user
 * @param {*} payload - email and password 
 */
function* login({ payload: { email, password } }) {
    console.log("redux aux saga", "login", "email, password", email, password );
    try {
        const response = yield call(apiClient.post, '/token/', { email, password });
        console.log("redux aux saga", "login response", response );
        //we store isAuthenticated param into Local Storage for the case if user reloaded the page
        yield localStorage.setItem("isAuthenticated", true);
        yield put(loginUserSuccess(response.access));            
    } catch (error) {
        yield put(loginUserFailed(error));
    }
}


/**
 * Logout the user
 */
function* logout() {
    console.log ("Auth saga logout");
    try {
        //we use isAuthorized param for the case if user reloaded the page
        localStorage.setItem("isAuthenticated", false);
        yield call(apiAuthorizedClient.post, '/logout/');
        yield put(logoutUserSuccess());
    } catch (error) {
        yield put(logoutUserFailed(error));
    }
}

/**
 * Register the user
 */
function* register({ payload: { email, password } }) {
    try {
        const response = yield call(apiClient.post, '/register/', { email, password });
        //we store isAuthenticated param into Local Storage for the case if user reloaded the page
        localStorage.setItem("isAuthenticated", true);
        yield put(registerUserSuccess(response.access));
    } catch (error) {
        yield put(authError(error));
    }
}


/**
 * forget password
 */
function* forgetPassword({ payload: { email } }) {
    try {
        const response = yield call(apiClient.post, '/password-reset/', { email });
        yield put(forgetPasswordSuccess(response.status));
    } catch (error) {
        yield put(authError(error));
    }
}


/**
 * Confirm the email
 */
function* confirmEmail({ payload: { token } }) {
    try {
      yield call(apiClient.post, '/confirmation-email/confirm/', { email_confirm_token: token });
      yield put(confirmEmailSuccess());
    } catch (error) {
        yield put(authError(error));
    }
  }

  /**
 * Send a link with confirmation email
 */
function* sendConfirmationEmail() {
    try {
      yield call(apiAuthorizedClient.post, '/confirmation-email/send/');
      yield put(sendConfirmationEmailSuccess());
    } catch (error) {
        yield put(authError(error));
    }
  }


  function* resetPasswordConfirm({ payload: { password, token } }) {
    try {
        yield call(apiClient.post, '/password-reset/confirm/', { password, token });
        yield put(resetPasswordConfirmSuccess());
    } catch (error) {
        yield put(authError(error));
    }
}

function* validateResetToken({ payload: { token } }) {
    try {
        yield call(apiClient.post, '/password-reset/validate_token/', { token });
        yield put(validateResetTokenSuccess());
    } catch (error) {
        yield put(authError(error));
    }
}

function* refreshTokenUpdate() {
    try {
        const response = yield call(apiClient.post, '/token/refresh/');
        yield put(refreshTokenUpdateSuccess(response.access));
        yield call(apiAuthorizedClient.resolve);
    } catch (error) {
        yield put(refreshTokenUpdateFailure(error));
    }
}

function* changePassword({ payload: { oldPassword, newPassword } }) {
    try {
        const response = yield call(
            apiAuthorizedClient.put,
            '/change-password/', 
            { 
                old_password: oldPassword, 
                new_password: newPassword 
            });
        yield put(changePasswordSuccess(response.message));
        yield delay(10000);
        yield put(hideChangePasswordSuccessMessage());
    } catch (error) {
        yield put(changePasswordFailed(error));
    }
}

export function* watchRefreshTokenUpdate() {
    yield takeEvery(REFRESH_TOKEN_UPDATE, refreshTokenUpdate);
}

export function* watchResetPasswordConfirm() {
    yield takeEvery(RESET_PASSWORD_CONFIRM, resetPasswordConfirm);
}

export function* watchValidateResetToken() {
    yield takeEvery(VALIDATE_RESET_TOKEN, validateResetToken);
}

export function* watchLoginUser() {
    yield takeEvery(LOGIN_USER, login);
}

export function* watchLogoutUser() {
    yield takeEvery(LOGOUT_USER, logout);
}

export function* watchRegisterUser() {
    yield takeEvery(REGISTER_USER, register);
}

export function* watchForgetPassword() {
    yield takeEvery(FORGET_PASSWORD, forgetPassword);
}

export function* watchConfirmEmail() {
    yield takeEvery(CONFIRM_EMAIL, confirmEmail);
}

export function* watchSendConfirmationEmail() {
    yield takeEvery(SEND_CONFIRMATION_EMAIL, sendConfirmationEmail);
}

export function* watchChangePassword() {
    yield takeEvery(CHANGE_PASSWORD, changePassword);
}

function* authSaga() {
    yield all([
        fork(watchLoginUser),
        fork(watchLogoutUser),
        fork(watchRegisterUser),
        fork(watchForgetPassword),
        fork(watchConfirmEmail),
        fork(watchSendConfirmationEmail),
        fork(watchResetPasswordConfirm), 
        fork(watchValidateResetToken),
        fork(watchRefreshTokenUpdate),
        fork(watchChangePassword),  
    ]);
}

export default authSaga;