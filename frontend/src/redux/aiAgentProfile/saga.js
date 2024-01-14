import { 
    call, 
    put, 
    takeEvery, 
    delay 
} from 'redux-saga/effects';
import apiAuthorizedClient from '../../helpers/apiAuthorizedClient';
import {
    SET_ACTIVE_AI_AGENT_PROFILE,
    GET_AI_AGENT_PROFILE, 
    UPDATE_AI_AGENT_PROFILE_DATA, 
    UPDATE_AI_AGENT_PROFILE_AVATAR 
} from './constants';
import {
    setActiveAiAgentProfileSuccess,
    setActiveAiAgentProfileFailed,

    getAiAgentProfileSuccess,
    getAiAgentProfileFailed,

    updateAiAgentProfileDataInitState,
    updateAiAgentProfileDataSuccess,
    updateAiAgentProfileDataFailed,
    
    updateAiAgentProfileAvatarInitState,
    updateAiAgentProfileAvatarSuccess,
    updateAiAgentProfileAvatarFailed
 } from './actions';
const api = apiAuthorizedClient;

function* setActiveAiAgentProfileSaga(action) {
    const agentAiProfileId = action.payload;

    try {
        const response = yield call(api.get, `/ai-agent-profiles/${agentAiProfileId}/`);
        yield put(setActiveAiAgentProfileSuccess(response));
    } catch (error) {
        yield put(setActiveAiAgentProfileFailed(error));
    }
}

function* getAiAgentProfileSaga({ payload: { id } }) {
    try {
        const response = yield call(api.get, `/ai-agent-profiles/${id}/`);
        yield put(getAiAgentProfileSuccess(response));
    } catch (error) {
        yield put(getAiAgentProfileFailed(error));
    }
}

function* updateAiAgentProfileDataSaga({ payload: { id, data } }) {
    try {
        const response = yield call(api.patch, `/ai-agent-profiles/${id}/`, data);
        yield put(updateAiAgentProfileDataSuccess(response));
        yield delay(10000);
        yield put(updateAiAgentProfileDataInitState());
    } catch (errors) {
        yield put(updateAiAgentProfileDataFailed(errors));
    }
}

function* updateAiAgentProfileAvatarSaga({ payload: { id, avatar } }) {
    try {
        let avatarData = new FormData();
        
        avatarData.append('avatar', avatar);
        const response = yield call(api.patch, `/ai-agent-profiles/${id}/`, avatarData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        yield put(updateAiAgentProfileAvatarSuccess(response.avatar));
        yield delay(10000);
        yield put(updateAiAgentProfileAvatarInitState());
    } catch (error) {
        yield put(updateAiAgentProfileAvatarFailed(error));
    }
}

export default function* aiAgentProfileSaga() {
    yield takeEvery(SET_ACTIVE_AI_AGENT_PROFILE, setActiveAiAgentProfileSaga);
    yield takeEvery(GET_AI_AGENT_PROFILE, getAiAgentProfileSaga);
    yield takeEvery(UPDATE_AI_AGENT_PROFILE_DATA, updateAiAgentProfileDataSaga);
    yield takeEvery(UPDATE_AI_AGENT_PROFILE_AVATAR, updateAiAgentProfileAvatarSaga);
}