import { eventChannel } from 'redux-saga';
import { call, put, take, takeEvery } from 'redux-saga/effects';
import {
  FETCH_CHATS_REQUEST,
  ADD_CHAT_REQUEST,
  DELETE_CHAT_REQUEST,
  FETCH_MESSAGES_REQUEST,
  DELETE_MESSAGE_REQUEST,
  WS_CONNECTION_START
} from './constants';
import apiAuthorizedClient from '../../helpers/apiAuthorizedClient';
import webSocketsAuthorizedClient from '../../helpers/webSocketsAuthorizedClient';
import {
  addChatSuccess,
  fetchChatsSuccess,
  deleteChatSuccess,
  fetchMessagesSuccess,
  deleteMessageSuccess,
  startWsConnection,
  wsConnectionSuccess,
  wsReceiveMessage,
  wsConnectionError,
  wsConnectionClosed
} from './actions';
const api = apiAuthorizedClient;

function* fetchChats() {
  try {
    const chats = yield call(api.get, '/chats/');
    yield put(fetchChatsSuccess(chats));
  } catch (error) {
    console.log(error);
  }
}

function* addChat(action) {
  const data = action.payload;
  try {
      const chat = yield call(api.post, '/chats/', {
          "user_id": data.user_id,
          "name": data.name
      });
      yield put(addChatSuccess, chat);
      if (data.message) {
        //TODO: case for new chat
        // yield put({ type: ADD_MESSAGE_REQUEST, payload: {
        //   "message_text": data.message,
        //   "chat_id": chat.id
        // }});    
      }
  } catch (error) {
    console.log(error);
  }
}

function* deleteChat(action) {
  console.log("chat saga deleteChat action ", action);
  try {
    yield call(api.delete, `/chats/${action.payload}/`);
    yield put(deleteChatSuccess(action.payload));
  } catch (error) {
    console.log(error);
  }
}

function* fetchMessages(action) {
  try {
    const messages = yield api.get(`/messages/?chat_id=${action.payload}`)
    yield put(fetchMessagesSuccess(messages));
    yield put(startWsConnection(action.payload));
  } catch (error) {
    console.log(error);
  }
}

function* deleteMessage(action) {
  try {
    yield call(api.delete, `/messages/${action.payload}/`);
    yield put(deleteMessageSuccess(action.payload));
  } catch (error) {
    console.log(error);
  }
}

function createWebSocketChannel(socket) {
  return eventChannel(emit => {
    socket.onopen = () => {
      emit(wsConnectionSuccess(socket));
    };
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Chat saga reateWebSocketChannel onmessage", data);
      emit(wsReceiveMessage(data.message));
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
  const socket = yield call(webSocketsAuthorizedClient.newSocket, `/chats/${action.payload}/`);
  const socketChannel = yield call(createWebSocketChannel, socket);

  while (true) {
    const action = yield take(socketChannel);
    yield put(action);
  }
}

export default function* chatSaga() {
  yield takeEvery(FETCH_CHATS_REQUEST, fetchChats);
  yield takeEvery(ADD_CHAT_REQUEST, addChat);
  yield takeEvery(DELETE_CHAT_REQUEST, deleteChat);
  yield takeEvery(FETCH_MESSAGES_REQUEST, fetchMessages);
  yield takeEvery(DELETE_MESSAGE_REQUEST, deleteMessage);
  yield takeEvery(WS_CONNECTION_START, webSocketSaga);
}