import {
    FETCH_CHATS_REQUEST,
    FETCH_CHATS_SUCCESS,
    ADD_CHAT_SUCCESS, 
    DELETE_CHAT_SUCCESS,
    FETCH_MESSAGES_REQUEST,
    FETCH_MESSAGES_SUCCESS, 
    ADD_MESSAGE_SUCCESS,
    DELETE_MESSAGE_SUCCESS,
    SET_ACTIVE_CHAT,
    SHOW_CHAT_WINDOW,
    SET_ACTIVE_NEW_CHAT,
    WS_CONNECTION_START,
    WS_CONNECTION_SUCCESS,
    WS_CONNECTION_ERROR,
    WS_CONNECTION_CLOSED,
    WS_RECEIVE_MESSAGE
} from './constants';

const INIT_STATE = {
  chats: [],
  messages: [],
  chatsLoading: true,
  activeChatId: 0,
  chatWindow: false,
  newChat: false,
  wsConnected: false
};

const Chat = (state = INIT_STATE, action) => {
  switch (action.type) {
    case SET_ACTIVE_CHAT:
        return { 
            ...state,
            activeChatId: Number(action.payload)
        };
    case SHOW_CHAT_WINDOW:
        return { 
            ...state,
            chatWindow: action.payload
        };
    case SET_ACTIVE_NEW_CHAT:
        return { 
            ...state,
            newChat: action.payload
        };
    case FETCH_CHATS_REQUEST:
    return { 
        ...state,
        chatsLoading: true
    };  
    case FETCH_CHATS_SUCCESS:
        return { 
            ...state,
            chats: action.payload,
            chatsLoading: false
        };
    case ADD_CHAT_SUCCESS:
        return { 
            ...state,
            chats: [...state.chats, action.payload],
            activeChatId: Number(action.payload.id),
            chatWindow: true,
            newChat: false
        };
    case DELETE_CHAT_SUCCESS:
        return { 
            ...state,
            chats: state.chats.filter(chat => chat.id !== action.payload)
        };
          
    case FETCH_MESSAGES_REQUEST:
        return { 
            ...state,
            activeChatId: Number(action.payload)
        };
    case FETCH_MESSAGES_SUCCESS:
        const existingMessagesMap = state.messages.reduce((map, message) => {
            map[message.id] = message;
            return map;
        }, {});
    
        action.payload.forEach(newMessage => {
            existingMessagesMap[newMessage.id] = newMessage;
        });
    
        const updatedMessages = Object.values(existingMessagesMap);
    
        return { 
            ...state,
            messages: updatedMessages
        };
    
    case ADD_MESSAGE_SUCCESS:
        return { 
            ...state,
            messages: [...state.messages, action.payload]
        };
    case DELETE_MESSAGE_SUCCESS:
        return { 
            ...state,
            messages: state.messages.filter(message => message.id !== action.payload.id)
        };

    case WS_CONNECTION_START:
        return {
            ...state,
            wsConnected: false
        };
    case WS_CONNECTION_SUCCESS:
        return {
            ...state,
            wsConnected: true
        };
    case WS_CONNECTION_ERROR:
        return {
            ...state,
            wsConnected: false
        };
    case WS_CONNECTION_CLOSED:
        return {
            ...state,
            wsConnected: false
        };
    case WS_RECEIVE_MESSAGE:
        // Assuming the WebSocket message contains a new chat message
        return {
            ...state,
            messages: [...state.messages, action.payload.message]
        };

    default: return { ...state };
  }
}

export default Chat;