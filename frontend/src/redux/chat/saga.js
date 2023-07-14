// sagas.js
import { takeEvery, put, take } from 'redux-saga/effects';
import {
  FETCH_DIALOGUES_REQUEST, ADD_DIALOGUE_REQUEST, DELETE_DIALOGUE_REQUEST,
  FETCH_MESSAGES_REQUEST, ADD_MESSAGE_REQUEST, DELETE_MESSAGE_REQUEST,
  FETCH_DIALOGUES_SUCCESS, ADD_DIALOGUE_SUCCESS, DELETE_DIALOGUE_SUCCESS,
  FETCH_MESSAGES_SUCCESS, ADD_MESSAGE_SUCCESS, DELETE_MESSAGE_SUCCESS
} from './constants';
import { GET_AUTHORIZED_USER_SUCCESS } from '../user/constants';
import apiAuthorizedClient from '../../helpers/apiAuthorizedClient';
const api = apiAuthorizedClient;


function* fetchDialogues() {
  try {
    // Wait for the users to be loaded
    yield take(GET_AUTHORIZED_USER_SUCCESS);

    const dialogues = yield api.get('/dialogues/');
    yield put({ type: FETCH_DIALOGUES_SUCCESS, payload: dialogues });
  } catch (error) {
    console.log(error);
  }
}

function* addDialogue(action) {
  const data = action.payload;
  try {
      const dialogue = yield api.post('/dialogues/', {
          "user_id": data.user_id,
          "name": data.name
      });
      yield put({ type: ADD_DIALOGUE_SUCCESS, payload: dialogue });
      if (data.message) {
        yield put({ type: ADD_MESSAGE_REQUEST, payload: {
          "message_text": data.message,
          "dialog_id": dialogue.id
        }});    
      }
  } catch (error) {
    console.log(error);
  }
}

function* deleteDialogue(action) {
  console.log("chat saga deleteDialogue action ", action);
  try {
    yield api.delete(`/dialogues/${action.payload}/`);
    yield put({ type: DELETE_DIALOGUE_SUCCESS, payload: action.payload });
  } catch (error) {
    console.log(error);
  }
}

function* fetchMessages(action) {
  try {
    const messages = yield api.get(`/messages/?dialog_id=${action.payload}`)
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

export default function* chatSaga() {
  yield takeEvery(FETCH_DIALOGUES_REQUEST, fetchDialogues);
  yield takeEvery(ADD_DIALOGUE_REQUEST, addDialogue);
  yield takeEvery(DELETE_DIALOGUE_REQUEST, deleteDialogue);
  yield takeEvery(FETCH_MESSAGES_REQUEST, fetchMessages);
  yield takeEvery(ADD_MESSAGE_REQUEST, addMessage);
  yield takeEvery(DELETE_MESSAGE_REQUEST, deleteMessage);
}
