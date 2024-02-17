import { 
    call, 
    put, 
    takeEvery 
} from 'redux-saga/effects';
import apiAuthorizedClient from '../../helpers/apiAuthorizedClient';
import {
    GET_AI_AGENT_PROFILE,
} from './constants';
import {
    getAiAgentProfileSuccess,
    getAiAgentProfileFailed,
} from './actions';

const api = apiAuthorizedClient;

function* getAiAgentProfileSaga({ payload: { agent_id } }) {
    try {
        const response = yield call(api.get, `/api/ai_agent_profiles_by_agent_id/${agent_id}/`);
        yield put(getAiAgentProfileSuccess(response));
    } catch (error) {
        yield put(getAiAgentProfileFailed(error));
    }
}

export default function* aiAgentProfileSaga() {
    yield takeEvery(GET_AI_AGENT_PROFILE, getAiAgentProfileSaga);
}