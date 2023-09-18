import _ from 'lodash';
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
    
    DELETE_MESSAGE,
    DELETE_MESSAGE_INIT_STATE,
    DELETE_MESSAGE_SUCCESS,
    DELETE_MESSAGE_FAILED,
    
    SET_ACTIVE_CHAT,
    SHOW_CHAT_WINDOW,
    SET_ACTIVE_NEW_CHAT,
} from './constants';

const INIT_STATE = {
    chats: [],
    activeChatId: 0,
    chatWindow: false,
    newChat: false,

    fetchChatsLoading: false,
    fetchChatsSuccess: false,
    fetchChatsErrors: null,

    addChatRequestMessage: undefined,
    addChatLoading: false,
    addChatSuccess: false,
    addChatErrors: null,

    deleteChatLoading: false,
    deleteChatSuccess: false,
    deleteChatErrors: null,

    messages: [],

    fetchMessagesLoading: false,
    fetchMessagesSuccess: false,
    fetchMessagesErrors: null,

    deleteMessageLoading: false,
    deleteMessageSuccess: false,
    deleteMessageErrors: null,
};

const Chat = (state = INIT_STATE, action) => {
    switch (action.type) {
        case CHAT_INIT:
            return INIT_STATE;

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
   
        case FETCH_CHATS:
            return {
                ...state,
                fetchChatsLoading: true,
                fetchChatsSuccess: false,
                fetchChatsErrors: null,
            };

        case FETCH_CHATS_INIT_STATE:
            return {
                ...state,
                fetchChatsLoading: false,
                fetchChatsSuccess: false,
                fetchChatsErrors: null,
            };

        case FETCH_CHATS_SUCCESS: {
            const chats = action.payload;
            let filteredChats = (Array.isArray(chats) && chats) || [];

            filteredChats = filteredChats.reverse();

            return {
                ...state,
                chats: filteredChats,
                fetchChatsLoading: false,
                fetchChatsSuccess: true,
                fetchChatsErrors: null,
            };
        }
            
        case FETCH_CHATS_FAILED:
            return {
                ...state,
                fetchChatsLoading: false,
                fetchChatsSuccess: false,
                fetchChatsErrors: action.payload,
            };

        case ADD_CHAT: {
            const actionPayload = action.payload;
            const messageRequest = (actionPayload && actionPayload.message) || undefined;
            
            return {
                ...state,
                addChatLoading: true,
                addChatSuccess: false,
                addChatErrors: null,
                addChatRequestMessage: messageRequest 
            };
        }
            

        case ADD_CHAT_INIT_STATE:
            return {
                ...state,
                addChatLoading: false,
                addChatSuccess: false,
                addChatErrors: null,
                addChatRequestMessage: undefined,
            };

        case ADD_CHAT_SUCCESS:
            return {
                ...state,
                addChatLoading: false,
                addChatSuccess: true,
                addChatErrors: null,
                chats: [action.payload, ...state.chats],
                activeChatId: Number(action.payload.id),
                chatWindow: true,
                newChat: false
            };

        case ADD_CHAT_FAILED:
            return {
                ...state,
                addChatLoading: false,
                addChatSuccess: false,
                addChatErrors: action.payload,
            };
        
        case DELETE_CHAT: 
            return {
                ...state,
                deleteChatLoading: true,
                deleteChatSuccess: false,
                deleteChatErrors: null,
            };

        case DELETE_CHAT_INIT_STATE:
            return {
                ...state,
                deleteChatLoading: false,
                deleteChatSuccess: false,
                deleteChatErrors: null,
            };

        case DELETE_CHAT_SUCCESS:
            return {
                ...state,
                deleteChatLoading: false,
                deleteChatSuccess: true,
                deleteChatErrors: null,
                chats: state.chats.filter(chat => chat.id !== action.payload)
            };

        case DELETE_CHAT_FAILED:
            return {
                ...state,
                deleteChatLoading: false,
                deleteChatSuccess: false,
                deleteChatErrors: action.payload,
            };
            
        case FETCH_MESSAGES:
            return {
                ...state,
                fetchMessagesLoading: true,
                fetchMessagesSuccess: false,
                fetchMessagesErrors: null,
                activeChatId: Number(action.payload)
            };

        case FETCH_MESSAGES_INIT_STATE:
            return {
                ...state,
                fetchMessagesLoading: false,
                fetchMessagesSuccess: false,
                fetchMessagesErrors: null,
            };

        case FETCH_MESSAGES_SUCCESS:
            {
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
                    fetchMessagesLoading: false,
                    fetchMessagesSuccess: true,
                    fetchMessagesErrors: null,
                    messages: updatedMessages
                }
            };

        case FETCH_MESSAGES_FAILED:
            return {
                ...state,
                fetchMessagesLoading: false,
                fetchMessagesSuccess: false,
                fetchMessagesErrors: action.payload,
            };
            
        case DELETE_MESSAGE: 
            return {
                ...state,
                deleteMessageLoading: true,
                deleteMessageSuccess: false,
                deleteMessageErrors: null,
            };

        case DELETE_MESSAGE_INIT_STATE:
            return {
                ...state,
                deleteMessageLoading: false,
                deleteMessageSuccess: false,
                deleteMessageErrors: null,
            };
        
        case DELETE_MESSAGE_SUCCESS:
            return {
                ...state,
                deleteMessageLoading: false,
                deleteMessageSuccess: true,
                deleteMessageErrors: null,
                messages: state.messages.filter(message => message.id !== action.payload.id)
            };
            
        case DELETE_MESSAGE_FAILED: 
            return {
                ...state,
                deleteMessageLoading: false,
                deleteMessageSuccess: false,
                deleteMessageErrors: action.payload,
            };

           /**
        * TODO:
        * Add to a buffer chunks with "start" and "process" status.
        * And write them to the global messages store when we get "done" status.
        * The issue is how to show them correctly then into the right order.
        * 
        * TODO:    
        * Add handling of statuses for "start" and "done"   
        * 
        */
        // case RECEIVE_MESSAGE_CHUNK:
        //     {
        //         const receivedMessage = action.payload;
        //         const messagesList = [...state.messages];
                
        //         // Find the message by its id
        //         const messageIndex = messagesList.findIndex(message => message.id === receivedMessage.id);
                
        //         // If the message already exists, update its content
        //         if (messageIndex !== -1) {
        //             const existingMessage = messagesList[messageIndex];
        //             existingMessage.message_text += receivedMessage.message_chunk;
        //             messagesList[messageIndex] = existingMessage;
        //         } else {
        //             // If the message doesn't exist, simply add it to the list
        //             if (receivedMessage.message_chunk !== undefined) {
        //                 receivedMessage.message_text = receivedMessage.message_chunk;
        //             }
        //             messagesList.push(receivedMessage);
        //         }
                
        //         return {
        //             ...state,
        //             messages: messagesList
        //         };
        //     }

        default: return { ...state };
    }
}

export default Chat;