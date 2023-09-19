import { eventChannel } from 'redux-saga';
import { 
  put, 
  takeEvery,
  select,
  call 
} from 'redux-saga/effects';
import {
    WS_CONNECTION,
    WS_CONNECTION_SUCCESS,
    WS_CONNECTION_KILL,
} from './constants';
import {
  wsConnectionSuccess,
  wsConnectionError,
  wsConnectionClosed,
  wsReceiveMessage
} from './actions';
import webSocketsAuthorizedClient from '../../helpers/webSocketsAuthorizedClient';

const getWsConnection = (state) => state.Chat.wsConnection;

function createWebSocketChannelSaga(action) {
  const socket = action.payload;

  return eventChannel(emit => {
      socket.onopen = () => {
        emit(wsConnectionSuccess(socket));
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        // if (data.error) {
  
        // }
        //TODO: add handling errors data.error
        //{"error": "'prompt'"}
        emit(wsReceiveMessage(data));
      };

      socket.onerror = (event) => {
        //TODO: check error format in this case
        // emit(wsConnectionFailed(event));
      };

      socket.onclose = () => {
        emit(wsConnectionClosed());
      };
  
      //TODO: check how it works
      return () => {
        socket.close();
      };
    });
}

function* webSocketConnectionSuccess (){
  yield put(webSocketsAuthorizedClient.resolve());
}
  
function* killWebSocketSaga() {
  const wsConnection = yield select(getWsConnection);
  
  if (wsConnection !== null) {
    wsConnection.close();
  }
}
  
  export default function* chatSaga() {
    yield takeEvery(WS_CONNECTION, createWebSocketChannelSaga);
    yield takeEvery(WS_CONNECTION_SUCCESS, webSocketConnectionSuccess);
    yield takeEvery(WS_CONNECTION_KILL, killWebSocketSaga);
  }