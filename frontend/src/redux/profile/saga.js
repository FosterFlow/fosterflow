import { all, call, fork, put, takeEvery, delay} from 'redux-saga/effects';
import apiAuthorizedClient from '../../helpers/apiAuthorizedClient';
import { GET_PROFILE, UPDATE_PROFILE_DATA, UPDATE_PROFILE_AVATAR } from './constants';
import { 
    getProfileSuccess,
    updateProfileDataSuccess,
    hideProfileDataSuccessMessage,
    getProfileFailed,
    updateProfileDataFailed,
    updateProfileAvatarSuccess,
    updateProfileAvatarFailed,
    hideProfileAvatarSuccessMessage
 } from './actions';
const api = apiAuthorizedClient;

//TODO does saga reach API by each user request?
function* getProfile({ payload: { id } }) {
    try {
        const response = yield call(api.get, `/profiles/${id}/`);
        yield put(getProfileSuccess(response));
    } catch (error) {
        yield put(getProfileFailed(error));
    }
}

function* updateProfileData({ payload: { id, data } }) {
    try {
        const response = yield call(api.patch, `/profiles/${id}/`, data);
        yield put(updateProfileDataSuccess(response));
        yield delay(10000);
        yield put(hideProfileDataSuccessMessage());
    } catch (error) {
        yield put(updateProfileDataFailed(error));
    }
}

function* updateProfileAvatar({ payload: { id, avatar } }) {
    try {
        let avatarData = new FormData();
        
        avatarData.append('avatar', avatar);
        const response = yield call(api.patch, `/profiles/${id}/`, avatarData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        yield put(updateProfileAvatarSuccess(response));
        yield delay(10000);
        yield put(hideProfileAvatarSuccessMessage());
    } catch (error) {
        yield put(updateProfileAvatarFailed(error));
    }
}

export function* watchGetProfile() {
    yield takeEvery(GET_PROFILE, getProfile);
}

export function* watchUpdateProfileData() {
    yield takeEvery(UPDATE_PROFILE_DATA, updateProfileData);
}

export function* watchUpdateProfileAvatar() {
    yield takeEvery(UPDATE_PROFILE_AVATAR, updateProfileAvatar);
}

function* profileSaga() {
    yield all([
        fork(watchGetProfile),
        fork(watchUpdateProfileData),
        fork(watchUpdateProfileAvatar),
    ]);
}

export default profileSaga;