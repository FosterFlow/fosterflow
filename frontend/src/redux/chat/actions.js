// actions.js
import {
    FETCH_CHATS_REQUEST,
    ADD_CHAT_REQUEST,
    DELETE_CHAT_REQUEST,
    FETCH_MESSAGES_REQUEST,
    ADD_MESSAGE_REQUEST,
    DELETE_MESSAGE_REQUEST,
    SET_ACTIVE_CHAT,
    SHOW_CHAT_WINDOW,
    SET_ACTIVE_NEW_CHAT,
    WS_CONNECTION_START,
    WS_CONNECTION_SUCCESS,
    WS_CONNECTION_ERROR,
    WS_CONNECTION_CLOSED,
    WS_RECEIVE_MESSAGE
  } from './constants';
  
  /**
   * Specify an id of currently active chat. 
   * Required for show active chat into list of chats.
   * 
   * @param {number} chatId 
   * @returns 
   */
  export const setActiveChat = (chatId) => ({
    type: SET_ACTIVE_CHAT,
    payload: chatId
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

  export const fetchChats = () => ({
    type: FETCH_CHATS_REQUEST
  });
  
  export const addChat = (data) => {
    console.log ("Chat -> actions -> addChat data", data);
    return {
      type: ADD_CHAT_REQUEST,
      payload: data
    }
  };
  
  export const deleteChat = (id) => {
    console.log("actions deleteChat id ", id);
    return {
      type: DELETE_CHAT_REQUEST,
      payload: id
    }
  };
  
  //TODO split chats and messages?
  export const fetchMessages = (chatId) => ({
    type: FETCH_MESSAGES_REQUEST,
    payload: chatId
  });
  
  /* data : {
      "message_text": "text",
      "chat_id": 0
  } */
  export const addMessage = (data) => ({
    type: ADD_MESSAGE_REQUEST,
    payload: data
  });
  
  export const deleteMessage = (id) => ({
    type: DELETE_MESSAGE_REQUEST,
    payload: id
  });

  export const startWsConnection = (chatId) => ({
    type: WS_CONNECTION_START,
    payload: chatId
  });
  
  export const wsConnectionSuccess = () => ({
    type: WS_CONNECTION_SUCCESS
  });
  
  export const wsConnectionError = (error) => ({
    type: WS_CONNECTION_ERROR,
    payload: error
  });
  
  export const wsConnectionClosed = () => ({
    type: WS_CONNECTION_CLOSED
  });
  
  export const wsReceiveMessage = (message) => ({
    type: WS_RECEIVE_MESSAGE,
    payload: message
  });
