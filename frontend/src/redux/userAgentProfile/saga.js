import { call, put, takeEvery, delay } from 'redux-saga/effects';
import apiAuthorizedClient from '../../helpers/apiAuthorizedClient';
import {
    GET_USER_AGENT_PROFILE,
    UPDATE_USER_AGENT_PROFILE_DATA,
    UPDATE_USER_AGENT_PROFILE_AVATAR
} from './constants';
import {
    getUserAgentProfileSuccess,
    getUserAgentProfileFailed,
    updateUserAgentProfileDataInitState,
    updateUserAgentProfileDataSuccess,
    updateUserAgentProfileDataFailed,
    updateUserAgentProfileAvatarInitState,
    updateUserAgentProfileAvatarSuccess,
    updateUserAgentProfileAvatarFailed
} from './actions';

const api = apiAuthorizedClient;

function* getUserAgentProfileSaga(action) {
    const { id } = action.payload;
    try {
        const response = yield call(api.get, `/user-agent-profiles/${id}/`);
        yield put(getUserAgentProfileSuccess(response.data));
    } catch (error) {
        yield put(getUserAgentProfileFailed(error));
    }
}

function* updateUserAgentProfileDataSaga(action) {
    const { id, data } = action.payload;
    try {
        const response = yield call(api.patch, `/user-agent-profiles/${id}/`, data);
        yield put(updateUserAgentProfileDataSuccess(response.data));
        yield delay(10000);
        yield put(updateUserAgentProfileDataInitState());
    } catch (errors) {
        yield put(updateUserAgentProfileDataFailed(errors));
    }
}

function* updateUserAgentProfileAvatarSaga(action) {
    const { id, avatar } = action.payload;
    try {
        let avatarData = new FormData();
        avatarData.append('avatar', avatar);
        const response = yield call(api.patch, `/user-agent-profiles/${id}/avatar/`, avatarData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        yield put(updateUserAgentProfileAvatarSuccess(response.data.avatar));
        yield delay(10000);
        yield put(updateUserAgentProfileAvatarInitState());
    } catch (error) {
        yield put(updateUserAgentProfileAvatarFailed(error));
    }
}

export default function* userAgentProfileSaga() {
    yield takeEvery(GET_USER_AGENT_PROFILE, getUserAgentProfileSaga);
    yield takeEvery(UPDATE_USER_AGENT_PROFILE_DATA, updateUserAgentProfileDataSaga);
    yield takeEvery(UPDATE_USER_AGENT_PROFILE_AVATAR, updateUserAgentProfileAvatarSaga);
}