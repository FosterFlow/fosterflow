import { 
    all, 
    call, 
    fork, 
    put, 
    takeEvery, 
    delay 
} from 'redux-saga/effects';
import apiAuthorizedClient from '../../helpers/apiAuthorizedClient';
import { 
    GET_AGENT, 
    UPDATE_AGENT_DATA, 
    UPDATE_AGENT_AVATAR 
} from './constants';
import { 
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

//TODO does saga reach API by each user request?
function* getAgent({ payload: { id } }) {
    try {
        const response = yield call(api.get, `/agents/${id}/`);
        yield put(getAgentSuccess(response));
    } catch (error) {
        yield put(getAgentFailed(error));
    }
}

function* updateAgentData({ payload: { id, data } }) {
    try {
        const response = yield call(api.patch, `/agents/${id}/`, data);
        yield put(updateAgentDataSuccess(response));
        yield delay(10000);
        yield put(updateAgentDataInitState());
    } catch (errors) {
        yield put(updateAgentDataFailed(errors));
    }
}

function* updateAgentAvatar({ payload: { id, avatar } }) {
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

export function* watchGetAgent() {
    yield takeEvery(GET_AGENT, getAgent);
}

export function* watchUpdateAgentData() {
    yield takeEvery(UPDATE_AGENT_DATA, updateAgentData);
}

export function* watchUpdateAgentAvatar() {
    yield takeEvery(UPDATE_AGENT_AVATAR, updateAgentAvatar);
}

function* agentSaga() {
    yield all([
        fork(watchGetAgent),
        fork(watchUpdateAgentData),
        fork(watchUpdateAgentAvatar),
    ]);
}

export default agentSaga;