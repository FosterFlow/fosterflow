import { all } from 'redux-saga/effects';
import authSaga from './auth/saga';
import webSoketSaga from './webSocket/saga';
import userSaga from './user/saga';
import agentSaga from './agent/saga';
import aiAgentProfileSaga from './aiAgentProfile/saga';
import userAgentProfileSaga from './userAgentProfile/saga';
import chatSaga from './chat/saga';
import messageSaga from './chat/saga';
import LayoutSaga from './layout/saga';

export default function* rootSaga() {
    yield all([
        authSaga(),
        webSoketSaga(),
        userSaga(),
        agentSaga(),
        aiAgentProfileSaga(),
        userAgentProfileSaga(),
        chatSaga(),
        messageSaga(),
        LayoutSaga()
    ]);
}
