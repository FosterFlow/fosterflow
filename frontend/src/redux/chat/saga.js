import { eventChannel } from 'redux-saga';
import { 
  call, 
  put, 
  take, 
  takeEvery,
  delay,
  select 
} from 'redux-saga/effects';
import apiAuthorizedClient from '../../helpers/apiAuthorizedClient';
import webSocketsAuthorizedClient from '../../helpers/webSocketsAuthorizedClient';
import {
  FETCH_CHATS,
  ADD_CHAT,
  DELETE_CHAT,
  FETCH_MESSAGES,
  DELETE_MESSAGE,
    
  SET_ACTIVE_CHAT,
  SHOW_CHAT_WINDOW,
  SET_ACTIVE_NEW_CHAT,

  WS_CONNECTION_START,
  WS_CONNECTION_SUCCESS,
  WS_CONNECTION_ERROR,
  WS_CONNECTION_CLOSED,
  WS_RECEIVE_MESSAGE,
} from './constants';
import {
  setActiveChat,
  showChatWindow,
  setActiveNewChat,

  fetchChatsInitState,
  fetchChatsSuccess,
  fetchChatsFailed,

  addChatInitState,
  addChatSuccess,
  addChatFailed,

  deleteChatInitState,
  deleteChatSuccess,
  deleteChatFailed,

  fetchMessagesInitState,
  fetchMessagesSuccess,
  fetchMessagesFailed,

  deleteMessageInitState,
  deleteMessageSuccess,
  deleteMessageFailed,

  startWsConnection,
  wsConnectionSuccess,
  wsConnectionError,
  wsConnectionClosed,
  wsReceiveMessage
} from './actions';

const api = apiAuthorizedClient;
const getActiveChatId = (state) => state.Chat.activeChatId;
const getWsConnection = (state) => state.Chat.wsConnection;
const getAuthorizedUser = (state) => state.User.authorizedUser;

function* fetchChatsSaga() {
  try {
    const chats = yield call(api.get, '/chats/');
    yield put(fetchChatsSuccess(chats));
    yield delay(5000);
    yield put(fetchChatsInitState());
  } catch (errors) {
    yield put(fetchChatsFailed(errors));
    yield delay(10000);
    yield put(fetchChatsInitState());
  }
}

function* addChatSaga(action) {
  const data = action.payload;
  try {
      const chat = yield call(api.post, '/chats/', {
          "owner_id": data.user_id,
          "name": data.name,
          "addressee_id": 100
      });
      yield put(addChatSuccess(chat));
      yield put(startWsConnection(chat.id));      
  } catch (errors) {
    yield put(addChatFailed(errors));
    yield delay(10000);
    yield put(addChatInitState());
  }
}

function* deleteChatSaga(action) {
  console.log("chat saga deleteChat action ", action);
  try {
    yield call(api.delete, `/chats/${action.payload}/`);
    yield put(deleteChatSuccess(action.payload));
    yield delay(5000);
    yield put(deleteChatInitState());
  } catch (errors) {
    yield put(deleteChatFailed(errors));
    yield delay(10000);
    yield put(deleteChatInitState());
  }
}

function* fetchMessagesSaga(action) {
  try {
    const messages = yield api.get(`/messages/?chat_id=${action.payload}`)
    yield put(fetchMessagesSuccess(messages));
    yield put(startWsConnection(action.payload));
    yield delay(5000);
    yield put(fetchMessagesInitState());
  } catch (errors) {
    yield put(fetchMessagesFailed(errors));
    yield delay(10000);
    yield put(fetchMessagesInitState());
  }
}

function* deleteMessageSaga(action) {
  try {
    yield call(api.delete, `/messages/${action.payload}/`);
    yield put(deleteMessageSuccess(action.payload));
    yield delay(5000);
    yield put(deleteMessageInitState());
  } catch (errors) {
    yield put(deleteMessageFailed(errors));
    yield delay(10000);
    yield put(deleteMessageInitState());
  }
}

function createWebSocketChannelSaga(socket) {
  return eventChannel(emit => {
    socket.onopen = () => {
      emit(wsConnectionSuccess(socket));
    };
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Chat saga reateWebSocketChannel onmessage", data);
      //TODO: add handling errors data.error
      //{"error": "'prompt'"}
      emit(wsReceiveMessage(data));
    };
    socket.onerror = (event) => {
      emit(wsConnectionError(event));
    };
    socket.onclose = () => {
      emit(wsConnectionClosed());
    };
    return () => {
      socket.close();
    };
  });
}


function* webSocketSaga(action) {
  const chatId = action.payload;
  const socket = yield call(webSocketsAuthorizedClient.newSocket, `/chats/${chatId}/`);
  const socketChannel = yield call(createWebSocketChannelSaga, socket);

  while (true) {
    const action = yield take(socketChannel);
    yield put(action);
  }
}

function* webSocketSuccessSaga(action) {
  const chatId = action.payload;
  yield put(addChatInitState());

  const activeChatId = yield select(getActiveChatId);
  const wsConnection = yield select(getWsConnection);
  const authorizedUser = yield select(getAuthorizedUser);
  //TODO: need to move message to this method from saga of new chat creating 
  yield put(wsConnection.send(JSON.stringify(
          {
            "chat_id": activeChatId,
            // "prompt": textMessage,
            "owner_id": authorizedUser.id,
            "method": "request" 
          }
        )));
}



export default function* chatSaga() {
  yield takeEvery(FETCH_CHATS, fetchChatsSaga);
  yield takeEvery(ADD_CHAT, addChatSaga);
  yield takeEvery(DELETE_CHAT, deleteChatSaga);
  yield takeEvery(FETCH_MESSAGES, fetchMessagesSaga);
  yield takeEvery(DELETE_MESSAGE, deleteMessageSaga);
  yield takeEvery(WS_CONNECTION_START, webSocketSaga);
  yield takeEvery(WS_CONNECTION_SUCCESS, webSocketSuccessSaga);
}