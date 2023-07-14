// actions.js
import {
    FETCH_DIALOGUES_REQUEST, ADD_DIALOGUE_REQUEST,
    DELETE_DIALOGUE_REQUEST, FETCH_MESSAGES_REQUEST, ADD_MESSAGE_REQUEST,
    DELETE_MESSAGE_REQUEST, SET_ACTIVE_DIALOGUE, SHOW_CHAT_WINDOW, SET_ACTIVE_NEW_CHAT
  } from './constants';
  
  /**
   * Specify an id of currently active dialogue. 
   * Required for show active dialogue into list of dialogues.
   * 
   * @param {number} dialogId 
   * @returns 
   */
  export const setActiveDialogue = (dialogId) => ({
    type: SET_ACTIVE_DIALOGUE,
    payload: dialogId
  });

  /**
   * Window that shows list of messages. That action is actula for mobile version
   * @param {boolean} show - show chat window or not. 
   * 
   *  */ 
  export const showChatWindow = (show) => ({
    type: SHOW_CHAT_WINDOW,
    payload: show
  });

  /**
   * New chat by /chats url
   * 
   * @param {boolean} set - show window of a new chat or not 
   * @returns 
   */
  export const setActiveNewChat = (set) => ({
    type: SET_ACTIVE_NEW_CHAT,
    payload: set
  });

  export const fetchDialogues = () => ({
    type: FETCH_DIALOGUES_REQUEST
  });
  
  export const addDialogue = (data) => {
    console.log ("Chat -> actions -> addDialogue data", data);
    return {
      type: ADD_DIALOGUE_REQUEST,
      payload: data
    }
  };
  
  export const deleteDialogue = (id) => {
    console.log("actions deleteDialogue id ", id);
    return {
      type: DELETE_DIALOGUE_REQUEST,
      payload: id
    }
  };
  
  //TODO split dialogues and messages?
  export const fetchMessages = (dialogId) => ({
    type: FETCH_MESSAGES_REQUEST,
    payload: dialogId
  });
  
  /* data : {
      "message_text": "text",
      "dialog_id": 0
  } */
  export const addMessage = (data) => ({
    type: ADD_MESSAGE_REQUEST,
    payload: data
  });
  
  export const deleteMessage = (id) => ({
    type: DELETE_MESSAGE_REQUEST,
    payload: id
  });
