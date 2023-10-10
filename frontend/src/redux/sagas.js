import { all } from 'redux-saga/effects';
import authSaga from './auth/saga';
import webSoketSaga from './webSocket/saga';
import userSaga from './user/saga';
import agentSaga from './agents/saga';
import chatSaga from './chat/saga';
import LayoutSaga from './layout/saga';

export default function* rootSaga() {
    yield all([
        authSaga(),
        webSoketSaga(),
        userSaga(),
        agentSaga(),
        chatSaga(),
        LayoutSaga()
    ]);
}
