import _ from 'lodash';
import {
    SET_SKIP_FETCH_MESSAGES,
    
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
    //Actual if we came to the chat page from New Chat page.
    //Allows to prevent double request to API
    skipMessagesFetching: false,

    sendMessageErrors: null,
    //messages, that not accepted by the server yet. We show them with clocks into chat
    sendingMessagesQueue: [],
    //messages that we receive through the web socket
    receivingMessagesQueue: [],
    messages: [],

    fetchMessagesLoading: false,
    fetchMessagesSuccess: false,
    fetchMessagesErrors: null,

    deleteMessageLoading: false,
    deleteMessageSuccess: false,
    deleteMessageErrors: null,
};

const Message = (state = INIT_STATE, action) => {
    switch (action.type) {
        case SET_SKIP_FETCH_MESSAGES:
            return {
                ...state,
                skipMessagesFetching: action.payload,
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
                const receivingMessagesQueue = [...state.receivingMessagesQueue];
                
                if (receivedMessage.status === 'done') {
                    const newMessage = receivingMessagesQueue.find(message => message.id === receivedMessage.id);
                    const updatedReceivingMessagesQueue = receivingMessagesQueue.filter(message => message.id !== receivedMessage.id);
                    messagesList.push(newMessage);
                    return {
                        ...state,
                        messages: messagesList,
                        receivingMessagesQueue: updatedReceivingMessagesQueue
                    };
                }
                
                // Find the message by its id
                const messageIndex = receivingMessagesQueue.findIndex(message => message.id === receivedMessage.id);
                
                // If the message already exists, update its content
                if (messageIndex !== -1) {
                    const existingMessage = receivingMessagesQueue[messageIndex];
                    existingMessage.message_text += receivedMessage.message_chunk;
                    receivingMessagesQueue[messageIndex] = existingMessage;
                } else {
                    // If the message doesn't exist, simply add it to the list
                    if (receivedMessage.message_chunk !== undefined) {
                        receivedMessage.message_text = receivedMessage.message_chunk;
                    }
                    receivingMessagesQueue.push(receivedMessage);
                }
                
                return {
                    ...state,
                    receivingMessagesQueue: receivingMessagesQueue
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

export default Message;