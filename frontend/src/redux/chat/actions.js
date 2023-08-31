// actions.js
import {
  FETCH_CHATS,
  FETCH_CHATS_INIT_STATE,
  FETCH_CHATS_SUCCESS,
  FETCH_CHATS_FAILED,

  ADD_CHAT,
  ADD_CHAT_INIT_STATE,
  ADD_CHAT_SUCCESS,
  ADD_CHAT_FAILED,

  DELETE_CHAT,
  DELETE_CHAT_INIT_STATE,
  DELETE_CHAT_SUCCESS,
  DELETE_CHAT_FAILED,
  
  FETCH_MESSAGES,
  FETCH_MESSAGES_INIT_STATE,
  FETCH_MESSAGES_SUCCESS,
  FETCH_MESSAGES_FAILED, 
  
  DELETE_MESSAGE,
  DELETE_MESSAGE_INIT_STATE,
  DELETE_MESSAGE_SUCCESS,
  DELETE_MESSAGE_FAILED,
    
  SET_ACTIVE_CHAT,
  SHOW_CHAT_WINDOW,
  SET_ACTIVE_NEW_CHAT,

  WS_CONNECTION_START,
  WS_CONNECTION_SUCCESS,
  WS_CONNECTION_ERROR,
  WS_CONNECTION_CLOSED,
  WS_RECEIVE_MESSAGE,
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

  export const fetchChatsSuccess = (chats) => ({
    type: FETCH_CHATS_SUCCESS,
    payload: chats
  });
  
  export const addChat = (data) => {
    console.log ("Chat -> actions -> addChat data", data);
    return {
      type: ADD_CHAT_REQUEST,
      payload: data
    }
  };
  
  export const addChatSuccess = (newChat) => {
    return {
      type: ADD_CHAT_SUCCESS,
      payload: newChat
    }
  };

  export const deleteChat = (id) => {
    console.log("actions deleteChat id ", id);
    return {
      type: DELETE_CHAT_REQUEST,
      payload: id
    }
  };

  export const deleteChatSuccess = (id) => {
    return {
      type: DELETE_CHAT_SUCCESS,
      payload: id
    }
  };
  
  //TODO split chats and messages?
  export const fetchMessages = (chatId) => ({
    type: FETCH_MESSAGES_REQUEST,
    payload: chatId
  });

  export const fetchMessagesSuccess = (messages) => ({
    type: FETCH_MESSAGES_SUCCESS,
    payload: messages
  });
  
  export const deleteMessage = (id) => ({
    type: DELETE_MESSAGE_REQUEST,
    payload: id
  });

  export const deleteMessageSuccess = (id) => ({
    type: DELETE_MESSAGE_SUCCESS,
    payload: id
  });

  export const startWsConnection = (chatId) => ({
    type: WS_CONNECTION_START,
    payload: chatId
  });
  
  export const wsConnectionSuccess = (socket) => ({
    type: WS_CONNECTION_SUCCESS,
    payload: socket
  });
  
  export const wsConnectionError = (error) => ({
    type: WS_CONNECTION_ERROR,
    payload: error
  });
  
  export const wsConnectionClosed = () => ({
    type: WS_CONNECTION_CLOSED
  });
  
  export const wsReceiveMessage = (messageChunk) => ({
    type: WS_RECEIVE_MESSAGE,
    payload: messageChunk
  });
