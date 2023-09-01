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
  WS_RECEIVE_MESSAGE_CHUNK,
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
    type: FETCH_CHATS
  });

  export const fetchChatsInitState = () => ({
    type: FETCH_CHATS_INIT_STATE
  });

  export const fetchChatsSuccess = (chats) => ({
    type: FETCH_CHATS_SUCCESS,
    payload: chats
  });

  export const fetchChatsFailed = (errors) => ({
    type: FETCH_CHATS_FAILED,
    payload: errors
  });
  
  export const addChat = (newChatRequest) => {
    return {
      type: ADD_CHAT,
      payload: newChatRequest
    }
  };

  export const addChatInitState = () => {
    return {
      type: ADD_CHAT_INIT_STATE,
    }
  };
  
  export const addChatSuccess = (newChat) => {
    return {
      type: ADD_CHAT_SUCCESS,
      payload: newChat
    }
  };

  export const addChatFailed = (errors) => {
    return {
      type: ADD_CHAT_FAILED,
      payload: errors
    }
  };

  export const deleteChat = (chatId) => {
    return {
      type: DELETE_CHAT,
      payload: chatId
    }
  };

  export const deleteChatInitState = (chatId) => {
    return {
      type: DELETE_CHAT_INIT_STATE,
      payload: chatId
    }
  };

  export const deleteChatSuccess = (chatId) => {
    return {
      type: DELETE_CHAT_SUCCESS,
      payload: chatId
    }
  };

  export const deleteChatFailed = (errors) => {
    return {
      type: DELETE_CHAT_FAILED,
      payload: errors
    }
  };
  
  export const fetchMessages = (chatId) => ({
    type: FETCH_MESSAGES,
    payload: chatId
  });

  export const fetchMessagesInitState = () => ({
    type: FETCH_MESSAGES_INIT_STATE,
  });

  export const fetchMessagesSuccess = (messages) => ({
    type: FETCH_MESSAGES_SUCCESS,
    payload: messages
  });

  export const fetchMessagesFailed = (errors) => ({
    type: FETCH_MESSAGES_FAILED,
    payload: errors
  });
  
  export const deleteMessage = (messageId) => ({
    type: DELETE_MESSAGE,
    payload: messageId
  });

  export const deleteMessageInitState = () => ({
    type: DELETE_MESSAGE_INIT_STATE,
  });

  export const deleteMessageSuccess = (messageId) => ({
    type: DELETE_MESSAGE_SUCCESS,
    payload: messageId
  });

  export const deleteMessageFailed = (errors) => ({
    type: DELETE_MESSAGE_FAILED,
    payload: errors
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
    type: WS_RECEIVE_MESSAGE_CHUNK,
    payload: messageChunk
  });