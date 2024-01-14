import { 
    call, 
    put, 
    takeEvery, 
    delay 
} from 'redux-saga/effects';
import apiAuthorizedClient from '../../helpers/apiAuthorizedClient';
import {
    SET_ACTIVE_USER_AGENT_PROFILE,
    GET_USER_AGENT_PROFILE, 
    UPDATE_USER_AGENT_PROFILE_DATA, 
    UPDATE_USER_AGENT_PROFILE_AVATAR 
} from './constants';
import {
    setActiveUserAgentProfileSuccess,
    setActiveUserAgentProfileFailed,

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

function* setActiveUserAgentProfileSaga(action) {
    const userAgentProfileId = action.payload;

    try {
        const response = yield call(api.get, `/user-agent-profiles/${userAgentProfileId}/`);
        yield put(setActiveUserAgentProfileSuccess(response));
    } catch (error) {
        yield put(setActiveUserAgentProfileFailed(error));
    }
}

function* getUserAgentProfileSaga({ payload: { id } }) {
    try {
        const response = yield call(api.get, `/user-agent-profiles/${id}/`);
        yield put(getUserAgentProfileSuccess(response));
    } catch (error) {
        yield put(getUserAgentProfileFailed(error));
    }
}

function* updateUserAgentProfileDataSaga({ payload: { id, data } }) {
    try {
        const response = yield call(api.patch, `/user-agent-profiles/${id}/`, data);
        yield put(updateUserAgentProfileDataSuccess(response));
        yield delay(10000);
        yield put(updateUserAgentProfileDataInitState());
    } catch (errors) {
        yield put(updateUserAgentProfileDataFailed(errors));
    }
}

function* updateUserAgentProfileAvatarSaga({ payload: { id, avatar } }) {
    try {
        let avatarData = new FormData();
        
        avatarData.append('avatar', avatar);
        const response = yield call(api.patch, `/user-agent-profiles/${id}/`, avatarData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        yield put(updateUserAgentProfileAvatarSuccess(response.avatar));
        yield delay(10000);
        yield put(updateUserAgentProfileAvatarInitState());
    } catch (error) {
        yield put(updateUserAgentProfileAvatarFailed(error));
    }
}

export default function* userAgentProfileSaga() {
    yield takeEvery(SET_ACTIVE_USER_AGENT_PROFILE, setActiveUserAgentProfileSaga);
    yield takeEvery(GET_USER_AGENT_PROFILE, getUserAgentProfileSaga);
    yield takeEvery(UPDATE_USER_AGENT_PROFILE_DATA, updateUserAgentProfileDataSaga);
    yield takeEvery(UPDATE_USER_AGENT_PROFILE_AVATAR, updateUserAgentProfileAvatarSaga);
}