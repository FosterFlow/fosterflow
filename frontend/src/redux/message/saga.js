import { 
    call, 
    put, 
    takeEvery,
    delay
  } from 'redux-saga/effects';
  import apiAuthorizedClient from '../../helpers/apiAuthorizedClient';
  import {
    FETCH_MESSAGES,
    SEND_MESSAGE,
    DELETE_MESSAGE,
  } from './constants';
  import {
    fetchMessagesInitState,
    fetchMessagesSuccess,
    fetchMessagesFailed,
  
    sendMessageInitState,
    sendMessageSuccess,
    sendMessageFailed,
  
    deleteMessageInitState,
    deleteMessageSuccess,
    deleteMessageFailed,
  } from './actions';
  
  const api = apiAuthorizedClient;
  
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
  
  //messageHas allows to follow message status (success, failed, in progress) by different types of requests: AJAX and Web Sockets
  function* sendMessageSaga(action) {
    const newMessage = action.payload;
    const messageHash = newMessage.messageHash;
    try {
      const message = yield call(api.post, '/messages/create/', newMessage);
      yield put(sendMessageSuccess({...message, messageHash}));
    } catch (errors) {
      yield put(sendMessageFailed({
        ...errors, 
        messageHash
      }));
      yield delay(10000);
      yield put(sendMessageInitState());
    }
  }
  
  function* deleteMessageSaga(action) {
    try {
      yield call(api.delete, `/messages/${action.payload}/delete/`);
      yield put(deleteMessageSuccess(action.payload));
      yield delay(5000);
      yield put(deleteMessageInitState());
    } catch (errors) {
      yield put(deleteMessageFailed(errors));
      yield delay(10000);
      yield put(deleteMessageInitState());
    }
  }
  
  export default function* messageSaga() {
    yield takeEvery(FETCH_MESSAGES, fetchMessagesSaga);
    yield takeEvery(SEND_MESSAGE, sendMessageSaga);
    yield takeEvery(DELETE_MESSAGE, deleteMessageSaga);
  }