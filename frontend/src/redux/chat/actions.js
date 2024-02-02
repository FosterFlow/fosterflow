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
  
  FETCH_MESSAGES,
  FETCH_MESSAGES_INIT_STATE,
  FETCH_MESSAGES_SUCCESS,
  FETCH_MESSAGES_FAILED,

  SET_SKIP_FETCH_MESSAGES,
  
  SEND_MESSAGE,
  SEND_MESSAGE_INIT_STATE,
  SEND_MESSAGE_SUCCESS,
  SEND_MESSAGE_FAILED,

  RECEIVE_MESSAGE_CHUNK,
  RECEIVE_MESSAGE_CHUNK_FAILED,
  
  DELETE_MESSAGE,
  DELETE_MESSAGE_INIT_STATE,
  DELETE_MESSAGE_SUCCESS,
  DELETE_MESSAGE_FAILED,
    
  SET_ACTIVE_CHAT,
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

  /**
   * Skip or not
   * @param {Boolean} set 
   * @returns 
   */
  export const setSkipFetchMessages = (set) => ({
    type: SET_SKIP_FETCH_MESSAGES,
    payload: set
  });

  export const sendMessage = (messageData) => {
    //Using message hash we can identify which message request websockets chunks are related to  
    const messageHash = new Date().getTime().toString() + Math.floor(Math.random() * 1000000).toString();
    return {
      type: SEND_MESSAGE,
      payload: { ...messageData, messageHash }
    }
  };

  export const sendMessageInitState = () => ({
    type: SEND_MESSAGE_INIT_STATE,
  });

  export const sendMessageSuccess = (message) => ({
    type: SEND_MESSAGE_SUCCESS,
    payload: message
  });

  export const sendMessageFailed = (message) => ({
    type: SEND_MESSAGE_FAILED,
    payload: message
  });

  export const receiveMessageChunk = (messageChunkData) => ({
    type: RECEIVE_MESSAGE_CHUNK,
    payload: messageChunkData
  });

  export const receiveMessageChunkFailed = (errors) => ({
    type: RECEIVE_MESSAGE_CHUNK_FAILED,
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