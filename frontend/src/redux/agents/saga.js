import { 
    call, 
    put, 
    takeEvery, 
    delay 
} from 'redux-saga/effects';
import apiAuthorizedClient from '../../helpers/apiAuthorizedClient';
import {
    SET_ACTIVE_AGENT,
    GET_AGENTS,
    GET_USER_AGENT,   
    GET_AGENT, 
    UPDATE_AGENT_DATA, 
    UPDATE_AGENT_AVATAR 
} from './constants';
import {
    setActiveAgentSuccess,
    setActiveAgentFailed,

    getAgentsSuccess,
    getAgentsFailed,
    
    getUserAgentSuccess,
    getUserAgentFailed,

    getAgentSuccess,
    getAgentFailed,

    updateAgentDataInitState,
    updateAgentDataSuccess,
    updateAgentDataFailed,
    
    updateAgentAvatarInitState,
    updateAgentAvatarSuccess,
    updateAgentAvatarFailed
 } from './actions';
const api = apiAuthorizedClient;

function* setActiveAgentSaga(action) {
    const agentId = action.payload;

    try {
        const response = yield call(api.get, `/agents/${agentId}/`);
        yield put(setActiveAgentSuccess(response));
    } catch (error) {
        yield put(setActiveAgentFailed(error));
    }
}

function* getAgentsSaga() {
    try {
        const response = yield call(api.get, `/agents/`);
        yield put(getAgentsSuccess(response));
    } catch (errors) {
        yield put(getAgentsFailed(errors));
    }
}

function* getUserAgentSaga() {
    try {
        const response = yield call(api.get, `/agent/`);
        yield put(getUserAgentSuccess(response));
    } catch (errors) {
        yield put(getUserAgentFailed(errors));
    }
}

//TODO does saga reach API by each user request?
function* getAgentSaga({ payload: { id } }) {
    try {
        const response = yield call(api.get, `/agents/${id}/`);
        yield put(getAgentSuccess(response));
    } catch (error) {
        yield put(getAgentFailed(error));
    }
}

function* updateAgentDataSaga({ payload: { id, data } }) {
    try {
        const response = yield call(api.patch, `/agents/${id}/`, data);
        yield put(updateAgentDataSuccess(response));
        yield delay(10000);
        yield put(updateAgentDataInitState());
    } catch (errors) {
        yield put(updateAgentDataFailed(errors));
    }
}

function* updateAgentAvatarSaga({ payload: { id, avatar } }) {
    try {
        let avatarData = new FormData();
        
        avatarData.append('avatar', avatar);
        const response = yield call(api.patch, `/agents/${id}/`, avatarData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        yield put(updateAgentAvatarSuccess(response.avatar));
        yield delay(10000);
        yield put(updateAgentAvatarInitState());
    } catch (error) {
        yield put(updateAgentAvatarFailed(error));
    }
}

export default function* agentSaga() {
    yield takeEvery(SET_ACTIVE_AGENT, setActiveAgentSaga);
    yield takeEvery(GET_AGENTS, getAgentsSaga);
    yield takeEvery(GET_USER_AGENT, getUserAgentSaga);
    yield takeEvery(GET_AGENT, getAgentSaga);
    yield takeEvery(UPDATE_AGENT_DATA, updateAgentDataSaga);
    yield takeEvery(UPDATE_AGENT_AVATAR, updateAgentAvatarSaga);
}