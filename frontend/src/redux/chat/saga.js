import { 
  call, 
  put, 
  takeEvery,
  delay,
} from 'redux-saga/effects';
import apiAuthorizedClient from '../../helpers/apiAuthorizedClient';
import {
  FETCH_CHATS,
  ADD_CHAT,
  ADD_CHAT_SUCCESS,
  DELETE_CHAT,
  FETCH_MESSAGES,
  SEND_MESSAGE,
  DELETE_MESSAGE,
} from './constants';
import {
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

  sendMessage,
  sendMessageInitState,
  sendMessageSuccess,
  sendMessageFailed,

  deleteMessageInitState,
  deleteMessageSuccess,
  deleteMessageFailed,
  sendMessagesFailed
} from './actions';
import config from '../../config';

const api = apiAuthorizedClient;

function* fetchChatsSaga() {
  try {
    const chats = yield call(api.get, '/chats/');
    yield put(fetchChatsSuccess(chats));
    yield delay(5000);
    yield put(fetchChatsInitState());
  } catch (errors) {
    yield put(fetchChatsFailed(errors));
  }
}

function* addChatSaga(action) {
  const data = action.payload;
  try {
      const newChatData = yield call(api.post, '/chats/', {
        "addressee_id": config.BASE_MODEL_AGENT_ID,
        "owner_id": data.user_id,
        "name": data.name
      });
      yield put(addChatSuccess({
        ...newChatData,
        new_chat_message: data.message 
      }));
      yield put(addChatInitState());
  } catch (errors) {
    yield put(addChatFailed(errors));
    yield delay(10000);
    yield put(addChatInitState());
  }
}

function* addChatSuccessSaga(action) {
  const chatData = action.payload;
  yield put(sendMessage({
    "addressee_id": chatData.addressee_id,
    "chat_id": chatData.id,
    "message_text": chatData.new_chat_message,
    "owner_id": chatData.owner_id,
  }));
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
    yield delay(5000);
    yield put(fetchMessagesInitState());
  } catch (errors) {
    yield put(fetchMessagesFailed(errors));
  }
}

function* sendMessageSaga(action) {
  const newMessage = action.payload;
  const messageHash = newMessage.messageHash;
  try {
    const message = yield call(api.post, '/messages/', newMessage);
    yield put(sendMessageSuccess({...message, messageHash}));
  } catch (errors) {
    yield put(sendMessageFailed({...errors, messageHash}));
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


export default function* chatSaga() {
  yield takeEvery(FETCH_CHATS, fetchChatsSaga);
  yield takeEvery(ADD_CHAT, addChatSaga);
  yield takeEvery(ADD_CHAT_SUCCESS, addChatSuccessSaga); 
  yield takeEvery(DELETE_CHAT, deleteChatSaga);
  yield takeEvery(FETCH_MESSAGES, fetchMessagesSaga);
  yield takeEvery(SEND_MESSAGE, sendMessageSaga);
  yield takeEvery(DELETE_MESSAGE, deleteMessageSaga);
}