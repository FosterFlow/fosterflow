import { 
  call, 
  put, 
  takeEvery,
  delay
} from 'redux-saga/effects';
import apiAuthorizedClient from '../../helpers/apiAuthorizedClient';
import {
  SET_ACTIVE_CHAT,
  FETCH_CHATS,
  ADD_CHAT,
  ADD_CHAT_SUCCESS,
  DELETE_CHAT,
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
  
  setActiveChatInitState,
  setActiveChatSuccess,
  setActiveChatFailed
} from './actions';

import {
  sendMessage,
} from '../message/actions';

const api = apiAuthorizedClient;

function* fetchChatsSaga(action) {
  try {
    const chatsOwnerAgent = action.payload;
    const chats = yield call(api.get, `/chats/?owner_agent_id=${chatsOwnerAgent.id}`);
    yield put(fetchChatsSuccess(chats));
    yield delay(5000);
    yield put(fetchChatsInitState());
  } catch (errors) {
    yield put(fetchChatsFailed(errors));
  }
}

function* setActiveChatSaga(action) {
  try {
    const activeChatId = action.payload;
    if (activeChatId > 0) {
      const activeChat = yield call(api.get, `/chats/${activeChatId}/`);
      yield put(setActiveChatSuccess(activeChat));
      yield delay(1000);
    }
    yield put(setActiveChatInitState());
  } catch (errors) {
    yield put(setActiveChatFailed(errors));
  }
}

function* addChatSaga(action) {
  const data = action.payload;
  try {
      const newChatData = yield call(api.post, `/chats/create/`, data);
      yield put(addChatSuccess({
        ...newChatData,
        new_chat_message: data.message,
        addressee_agent_id: data.addressee_agent_id,
        owner_agent_id: data.owner_agent_id, 
      }));
      yield put(addChatInitState());
  } catch (errors) {
    yield put(addChatFailed(errors));
  }
}

function* addChatSuccessSaga(action) {
  const chatData = action.payload;
  yield put(sendMessage({
    "addressee_agent_id": chatData.addressee_agent_id,
    "chat_id": chatData.id,
    "message_text": chatData.new_chat_message,
    "owner_agent_id": chatData.owner_agent_id,
  }));
}

function* deleteChatSaga(action) {
  console.log("chat saga deleteChat action ", action);
  try {
    yield call(api.delete, `/chats/${action.payload}/delete/`);
    yield put(deleteChatSuccess(action.payload));
    yield delay(5000);
    yield put(deleteChatInitState());
  } catch (errors) {
    yield put(deleteChatFailed(errors));
    yield delay(10000);
    yield put(deleteChatInitState());
  }
}

export default function* chatSaga() {
  yield takeEvery(SET_ACTIVE_CHAT, setActiveChatSaga);
  yield takeEvery(FETCH_CHATS, fetchChatsSaga);
  yield takeEvery(ADD_CHAT, addChatSaga);
  yield takeEvery(ADD_CHAT_SUCCESS, addChatSuccessSaga); 
  yield takeEvery(DELETE_CHAT, deleteChatSaga);
}