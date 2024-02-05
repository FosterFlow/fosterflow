import _ from 'lodash';
import {
    CHAT_INIT,

    SET_ACTIVE_CHAT,
    SET_ACTIVE_CHAT_INIT_STATE,
    SET_ACTIVE_CHAT_SUCCESS,
    SET_ACTIVE_CHAT_FAILED,

    SET_SKIP_FETCH_MESSAGES,
    
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

    SEND_MESSAGE,
    SEND_MESSAGE_INIT_STATE,
    SEND_MESSAGE_SUCCESS,
    SEND_MESSAGE_FAILED,
    
    DELETE_MESSAGE,
    DELETE_MESSAGE_INIT_STATE,
    DELETE_MESSAGE_SUCCESS,
    DELETE_MESSAGE_FAILED,

    RECEIVE_MESSAGE_CHUNK,
    RECEIVE_MESSAGE_CHUNK_FAILED,
} from './constants';

const INIT_STATE = {
    chats: [],
    
    activeChatId: 0,
    activeChat: null, 
    activeChatLoading: false,
    activeChatSuccess: false,
    activeChatErrors: null,    

    //Actual if we came to the chat page from New Chat page.
    //Allows to prevent double request to API
    skipMessagesFetching: false,

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

    sendMessageErrors: null,
    //messages, that not accepted by the server yet. We show them with clocks into chat
    sendingMessagesQueue: [],
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

        case SET_ACTIVE_CHAT: {
            return { 
                ...state,
                activeChatId: Number(action.payload),
                activeChat: null,
                activeChatLoading: true,
                activeChatSuccess: false,
                activeChatSuccess: null, 
            };
        }

        case SET_ACTIVE_CHAT_INIT_STATE:
            return {
                ...state,
                activeChatLoading: false,
                activeChatSuccess: false,
                activeChatErrors: null, 
            };

        case SET_ACTIVE_CHAT_SUCCESS: {
            return {
                ...state,
                activeChat: action.payload, 
                activeChatLoading: false,
                activeChatSuccess: true,
                activeChatErrors: null, 
            };
        }
            
        case SET_ACTIVE_CHAT_FAILED:
            return {
                ...state,
                activeChatLoading: false,
                activeChatSuccess: false,
                activeChatErrors: action.payload, 
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
    
        case SET_SKIP_FETCH_MESSAGES:
            return {
                ...state,
                skipMessagesFetching: action.payload,
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
                activeChat: action.payload,
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
            
        case FETCH_MESSAGES: {
            return {
                ...state,
                fetchMessagesLoading: true,
                fetchMessagesSuccess: false,
                fetchMessagesErrors: null,
            };
        }

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

        case SEND_MESSAGE: {
              return {
                ...state,
                sendMessageErrors: null,
                //List of messages, for which we didn't get an approval from server, that they were added to the database.
                sendingMessagesQueue: [...state.sendingMessagesQueue, action.payload]
              };
        }
    
        case SEND_MESSAGE_INIT_STATE:
            return {
                ...state,
                sendMessageErrors: null,
                sendingMessagesQueue: []
            };
    
        case SEND_MESSAGE_SUCCESS: {
            const filteredQueue = state.sendingMessagesQueue.filter(
                message => message.messageHash !== action.payload.messageHash
              );

            const existingMessagesMap = state.messages.reduce((map, message) => {
                map[message.id] = message;
                return map;
            }, {});

            //I did to rewrite existing messages with same ids to do not duploicate them.
            //It's relevant when we create a new chat.
            //TODO: in case f the new chat we don't have to make an additional API request for messages list
            const newMessage = action.payload
            existingMessagesMap[newMessage.id] = newMessage;

            const updatedMessages = Object.values(existingMessagesMap);

            return {
                ...state,
                sendMessageErrors: null,
                messages: updatedMessages,
                sendingMessagesQueue: filteredQueue
            }; 
        }

        case SEND_MESSAGE_FAILED: {
            const filteredQueue = state.sendingMessagesQueue.filter(
                message => message.messageHash !== action.payload.messageHash
                );

            return {
                ...state,
                sendMessageErrors: action.payload,
                sendingMessagesQueue: filteredQueue
            };
        }
            
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
        case RECEIVE_MESSAGE_CHUNK:
            {
                const receivedMessage = action.payload;
                const messagesList = [...state.messages];
                
                // Find the message by its id
                const messageIndex = messagesList.findIndex(message => message.id === receivedMessage.id);
                
                // If the message already exists, update its content
                if (messageIndex !== -1) {
                    const existingMessage = messagesList[messageIndex];
                    existingMessage.message_text += receivedMessage.message_chunk;
                    messagesList[messageIndex] = existingMessage;
                } else {
                    // If the message doesn't exist, simply add it to the list
                    if (receivedMessage.message_chunk !== undefined) {
                        receivedMessage.message_text = receivedMessage.message_chunk;
                    }
                    messagesList.push(receivedMessage);
                }
                
                return {
                    ...state,
                    messages: messagesList
                };
            }

        case RECEIVE_MESSAGE_CHUNK_FAILED: {
            return {
                ...state
            }
        }

        default: return { ...state };
    }
}

export default Chat;