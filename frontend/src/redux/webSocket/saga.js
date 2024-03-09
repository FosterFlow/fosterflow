import { 
  eventChannel 
} from 'redux-saga';
import { 
  put, 
  takeEvery,
  select,
  call,
  take 
} from 'redux-saga/effects';
import {
    WS_CONNECTION,
    WS_CONNECTION_SUCCESS,
    WS_CONNECTION_KILL,
    WS_RECEIVE_MESSAGE,
    WS_RECEIVE_MESSAGE_FAILED,
} from './constants';
import {
  wsConnectionSuccess,
  wsConnectionClosed,
  wsReceiveMessage,
  wsReceiveMessageFailed
} from './actions';
import webSocketsAuthorizedClient from '../../helpers/webSocketsAuthorizedClient';

const getWsConnection = (state) => state.WebSocket.wsConnection;
const getWsResponseHandlers = (state) => state.WebSocket.webSocketsResponseHandlers;

function createWebSocketChannelSaga(socket) {
  return eventChannel(emit => {
      socket.onopen = () => {
        emit(wsConnectionSuccess(socket));
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        emit(wsReceiveMessage(data));
      };

      socket.onerror = (event) => {
        const data = JSON.parse(event.data);
        emit(wsReceiveMessageFailed(data));
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

function* watchWebSocketChannel(action) {
  const socket = action.payload;

  const wsChannel = yield call(createWebSocketChannelSaga, socket);

  while (true) {
      const action = yield take(wsChannel);
      yield put(action);
  }
}

function* webSocketConnectionSuccess (){
  yield call(webSocketsAuthorizedClient.resolve);
}
  
function* killWebSocketSaga() {
  const wsConnection = yield select(getWsConnection);
  
  if (wsConnection !== null) {
    wsConnection.close();
  }
}

function* webSocketReceiveMessageSaga(action){
  const wsResponseHandlers = yield select(getWsResponseHandlers);
  const messageData = action.payload;
  const type = messageData.type;

  if (typeof type === 'string' && type.length > 0) {
    if (wsResponseHandlers[type] !== undefined) {
      yield put(wsResponseHandlers[type].onMessage(messageData));
      return;
    }
    console.error("wsResponseHandlers[type] is not defined. webSocketReceiveMessageSaga wsResponseHandlers", wsResponseHandlers);
    return;
  }

  console.error("Type is not defined. webSocketReceiveMessageSaga messageData", messageData);
}

function* webSocketReceiveMessageFailedSaga (action){
  const wsResponseHandlers = yield select(getWsResponseHandlers);
  const errors = action.payload;
  const type = errors.send_type || errors.type;

  if (typeof type === 'string' && type.length > 0) {
    if (wsResponseHandlers[type] !== undefined) {
      yield put(wsResponseHandlers[type].onError(errors));
      return;
    }
    console.error("wsResponseHandlers[type] is not defined. webSocketReceiveMessageSaga wsResponseHandlers", wsResponseHandlers);
    return;
  }

  console.error("Type is not defined. webSocketReceiveMessageSaga errors", errors);
}
  
export default function* chatSaga() {
  yield takeEvery(WS_CONNECTION, watchWebSocketChannel);
  yield takeEvery(WS_CONNECTION_SUCCESS, webSocketConnectionSuccess);
  yield takeEvery(WS_CONNECTION_KILL, killWebSocketSaga);
  yield takeEvery(WS_RECEIVE_MESSAGE, webSocketReceiveMessageSaga);
  yield takeEvery(WS_RECEIVE_MESSAGE_FAILED, webSocketReceiveMessageFailedSaga);
}