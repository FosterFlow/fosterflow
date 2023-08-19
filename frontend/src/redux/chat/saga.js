import { takeEvery, put } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import {
  FETCH_CHATS_REQUEST,
  ADD_CHAT_REQUEST,
  DELETE_CHAT_REQUEST,
  FETCH_MESSAGES_REQUEST,
  ADD_MESSAGE_REQUEST,
  DELETE_MESSAGE_REQUEST,
  FETCH_CHATS_SUCCESS,
  ADD_CHAT_SUCCESS,
  DELETE_CHAT_SUCCESS,
  FETCH_MESSAGES_SUCCESS,
  ADD_MESSAGE_SUCCESS,
  DELETE_MESSAGE_SUCCESS,
  WS_CONNECTION_START
} from './constants';
import apiAuthorizedClient from '../../helpers/apiAuthorizedClient';
const api = apiAuthorizedClient;

function* fetchChats() {
  try {
    const chats = yield api.get('/chats/');
    yield put({ type: FETCH_CHATS_SUCCESS, payload: chats });
  } catch (error) {
    console.log(error);
  }
}

function* addChat(action) {
  const data = action.payload;
  try {
      const chat = yield api.post('/chats/', {
          "user_id": data.user_id,
          "name": data.name
      });
      yield put({ type: ADD_CHAT_SUCCESS, payload: chat });
      if (data.message) {
        yield put({ type: ADD_MESSAGE_REQUEST, payload: {
          "message_text": data.message,
          "chat_id": chat.id
        }});    
      }
  } catch (error) {
    console.log(error);
  }
}

function* deleteChat(action) {
  console.log("chat saga deleteChat action ", action);
  try {
    yield api.delete(`/chats/${action.payload}/`);
    yield put({ type: DELETE_CHAT_SUCCESS, payload: action.payload });
  } catch (error) {
    console.log(error);
  }
}

function* fetchMessages(action) {
  try {
    const messages = yield api.get(`/messages/?chat_id=${action.payload}`)
    yield put({ type: FETCH_MESSAGES_SUCCESS, payload: messages });
  } catch (error) {
    console.log(error);
  }
}

function* addMessage(action) {
  try {
    const message = yield api.post('/messages/', action.payload);
    yield put({ type: ADD_MESSAGE_SUCCESS, payload: message });
  } catch (error) {
    console.log(error);
  }
}

function* deleteMessage(action) {
  try {
    yield api.delete(`/messages/${action.payload}/`);
    yield put({ type: DELETE_MESSAGE_SUCCESS, payload: action.payload });
  } catch (error) {
    console.log(error);
  }
}


function createWebSocketConnection(chatId, token) {
  //TODO: move to apiAuthorizedClient.js
  return new WebSocket(
    `ws://localhost:8000/ws/chats/${chatId}/?access=${token}`
  );
}

function* watchMessages(socket) {
  const socketChannel = eventChannel(emit => {
    socket.onmessage = (event) => {
      emit(JSON.parse(event.data));
    };
    socket.onerror = (errorEvent) => {
      emit(new Error(errorEvent.reason));
    };
    socket.onclose = (event) => {
      // Close the channel when the socket closes
      emit(END);
    };
    return () => {
      socket.close();
    };
  });

  try {
    while (true) {
      const payload = yield take(socketChannel);
      yield put(wsReceiveMessage(payload));
    }
  } catch (error) {
    console.error("Socket error:", error);
  } finally {
    console.log("WebSocket was closed");
  }
}

function* webSocketSaga(action) {
  const { chatId, token } = action.payload;
  const socket = yield call(createWebSocketConnection, chatId, token);
  
  socket.onopen = () => {
    put(wsConnectionSuccess());
  };

  const task = yield fork(watchMessages, socket);

  socket.onerror = (event) => {
    put(wsConnectionError(event));
  };

  socket.onclose = (event) => {
    put(wsConnectionClosed());
  };

  // Here you can add logic to send messages using socket.send
}

export default function* chatSaga() {
  yield takeEvery(FETCH_CHATS_REQUEST, fetchChats);
  yield takeEvery(ADD_CHAT_REQUEST, addChat);
  yield takeEvery(DELETE_CHAT_REQUEST, deleteChat);
  yield takeEvery(FETCH_MESSAGES_REQUEST, fetchMessages);
  yield takeEvery(ADD_MESSAGE_REQUEST, addMessage);
  yield takeEvery(DELETE_MESSAGE_REQUEST, deleteMessage);
  yield takeEvery(WS_CONNECTION_START, wsSaga);
}