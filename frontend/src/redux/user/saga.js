import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import apiAuthorizedClient from '../../helpers/apiAuthorizedClient';
import { GET_USERS, GET_USER, UPDATE_USER, DELETE_USER, GET_AUTHORIZED_USER } from './constants';
import { getUserSuccess, updateUserSuccess, userError, getAuthorizedUserSuccess } from './actions';
const api = apiAuthorizedClient;

function* getAuthorizedUser({ payload }) {
    try {
        const response = yield call(api.get, `/user/`, payload);
        yield put(getAuthorizedUserSuccess(response));
    } catch (error) {
        yield put(userError(error));
    }
}

function* getUsers() {
    try {
        const response = yield call(api.get, `/users/`);
        yield put(getUserSuccess(response));
    } catch (error) {
        yield put(userError(error));
    }
}

function* getUser({ payload: { id } }) {
    try {
        const response = yield call(api.get, `/users/${id}/`);
        yield put(getUserSuccess(response));
    } catch (error) {
        yield put(userError(error));
    }
}

function* updateUser({ payload: { id, data } }) {
    try {
        const response = yield call(api.patch, `/users/${id}/`, data);
        yield put(updateUserSuccess(response));
    } catch (error) {
        yield put(userError(error));
    }
}

function* deleteUser({ payload: { id } }) {
    try {
        yield call(api.delete, `/users/${id}/`);
    } catch (error) {
        yield put(userError(error));
    }
}

export function* watchGetAuthorizedUser() {
    yield takeEvery(GET_AUTHORIZED_USER, getAuthorizedUser);
}

export function* watchGetUsers() {
    yield takeEvery(GET_USERS, getUsers);
}

export function* watchGetUser() {
    yield takeEvery(GET_USER, getUser);
}

export function* watchUpdateUser() {
    yield takeEvery(UPDATE_USER, updateUser);
}

export function* watchDeleteUser() {
    yield takeEvery(DELETE_USER, deleteUser);
}


function* userSaga() {
    yield all([
        fork(watchGetAuthorizedUser),
        fork(watchGetUsers),
        fork(watchGetUser),
        fork(watchUpdateUser),
        fork(watchDeleteUser),
    ]);
}

export default userSaga;
