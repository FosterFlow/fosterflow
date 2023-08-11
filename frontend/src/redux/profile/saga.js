import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import apiAuthorizedClient from '../../helpers/apiAuthorizedClient';
import { GET_PROFILE, UPDATE_PROFILE } from './constants';
import { getProfileSuccess, updateProfileSuccess, profileError } from './actions';
const api = apiAuthorizedClient;

//TODO does saga reach API by each user request?
function* getProfile({ payload: { id } }) {
    try {
        const response = yield call(api.get, `/profiles/${id}/`);
        yield put(getProfileSuccess(response));
    } catch (error) {
        yield put(profileError(error));
    }
}

function* updateProfile({ payload: { id, data, avatar } }) {
    try {
        let formData = new FormData();
        
        // Append data to formData
        for (let key in data) {
            formData.append(key, data[key]);
        }

        // Append the avatar file if provided
        if (avatar) {
            formData.append('avatar', avatar);
        }

        const response = yield call(api.patch, `/profiles/${id}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        
        yield put(updateProfileSuccess(response));
    } catch (error) {
        yield put(profileError(error));
    }
}

export function* watchGetProfile() {
    yield takeEvery(GET_PROFILE, getProfile);
}

export function* watchUpdateProfile() {
    yield takeEvery(UPDATE_PROFILE, updateProfile);
}

function* profileSaga() {
    yield all([
        fork(watchGetProfile),
        fork(watchUpdateProfile),
    ]);
}

export default profileSaga;