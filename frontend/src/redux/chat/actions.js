// actions.js
import {
  CHAT_INIT,
  
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
  
  SET_ACTIVE_CHAT,
  SET_ACTIVE_CHAT_INIT_STATE,
  SET_ACTIVE_CHAT_SUCCESS,
  SET_ACTIVE_CHAT_FAILED
} from './constants';

export const chatInit = () => ({
  type: CHAT_INIT,
});
  
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

  export const setActiveChatInitState = () => ({
    type: SET_ACTIVE_CHAT_INIT_STATE
  });

  export const setActiveChatSuccess = (chat) => ({
    type: SET_ACTIVE_CHAT_SUCCESS,
    payload: chat
  });

  export const setActiveChatFailed = (errors) => ({
    type: SET_ACTIVE_CHAT_FAILED,
    payload: errors
  });

  export const fetchChats = (chatsOwnerAgent) => ({
    type: FETCH_CHATS,
    payload: chatsOwnerAgent
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