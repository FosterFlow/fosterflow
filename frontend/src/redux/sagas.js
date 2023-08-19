import { all } from 'redux-saga/effects';
import authSaga from './auth/saga';
import userSaga from './user/saga';
import profileSaga from './profile/saga';
import chatSaga from './chat/saga';
import LayoutSaga from './layout/saga';

export default function* rootSaga() {
    yield all([
        authSaga(),
        userSaga(),
        profileSaga(),
        chatSaga(),
        LayoutSaga()
    ]);
}
