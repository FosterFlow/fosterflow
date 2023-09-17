import { eventChannel } from 'redux-saga';
import { 
  call, 
  put, 
  take, 
  takeEvery,
  select 
} from 'redux-saga/effects';
import apiAuthorizedClient from '../../helpers/apiAuthorizedClient';
import webSocketsAuthorizedClient from '../../helpers/webSocketsAuthorizedClient';
import {
  WS_CONNECTION_START,
  WS_CONNECTION_KILL,
  WS_CONNECTION_SUCCESS,
  WS_CONNECTION_ERROR,
  WS_CONNECTION_CLOSED,
  WS_RECEIVE_MESSAGE,
} from './constants';
import {
  addChatInitState,

  wsConnectionSuccess,
  wsConnectionError,
  wsConnectionClosed,
  wsReceiveMessage
} from './actions';

const api = apiAuthorizedClient;
const getActiveChatId = (state) => state.Chat.activeChatId;
const getWsConnection = (state) => state.Chat.wsConnection;
const getAddChatRequestMessage = (state) => state.Chat.addChatRequestMessage;
const getAuthorizedUser = (state) => state.User.authorizedUser;

function createWebSocketChannelSaga(socket) {
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
  
  
function* startWebSocketSaga(action) {
    const chatId = action.payload;
    const wsConnection = yield select(getWsConnection);
  
    if (wsConnection !== null) {
      wsConnection.close();
    }
    const socket = yield call(webSocketsAuthorizedClient.newSocket, `/chats/${chatId}/`);
    const socketChannel = createWebSocketChannelSaga(socket);
  
    while (true) {
      const action = yield take(socketChannel);
      yield put(action);
    }
}
  
function* killWebSocketSaga(action) {
    const chatId = action.payload;
    const wsConnection = yield select(getWsConnection);
  
    if (wsConnection !== null) {
      wsConnection.close();
    }
  }
  
function* webSocketSuccessSaga() {
    const addChatRequestMessage = yield select(getAddChatRequestMessage);
    
    if (addChatRequestMessage === undefined) {
      yield put(addChatInitState());
      return;
    }
  
    const activeChatId = yield select(getActiveChatId);
    const wsConnection = yield select(getWsConnection);
    const authorizedUser = yield select(getAuthorizedUser);
    wsConnection.send(JSON.stringify(
    {
        "chat_id":  activeChatId,
    "prompt": addChatRequestMessage,
    "owner_id": authorizedUser.id,
    "method": "request" 
    }
    ));
    yield put(addChatInitState());
  }

  export default function* chatSaga() {
    yield takeEvery(WS_CONNECTION_START, startWebSocketSaga);
    yield takeEvery(WS_CONNECTION_KILL, killWebSocketSaga);
    yield takeEvery(WS_CONNECTION_SUCCESS, webSocketSuccessSaga);
  }