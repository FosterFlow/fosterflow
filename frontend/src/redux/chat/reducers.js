import {
    CHAT_INIT,

    SET_ACTIVE_CHAT,
    SET_ACTIVE_CHAT_INIT_STATE,
    SET_ACTIVE_CHAT_SUCCESS,
    SET_ACTIVE_CHAT_FAILED,

    FETCH_CHATS,
    FETCH_CHATS_INIT_STATE,
    FETCH_CHATS_SUCCESS,
    FETCH_CHATS_FAILED,

    ADD_CHAT,
    ADD_CHAT_INIT_STATE,
    ADD_CHAT_SUCCESS,
    ADD_CHAT_FAILED,

    UPDATE_CHAT_UPDATED_AT,

    DELETE_CHAT,
    DELETE_CHAT_INIT_STATE,
    DELETE_CHAT_SUCCESS,
    DELETE_CHAT_FAILED,
} from './constants';

const INIT_STATE = {
    chats: [],

    activeChatId: 0,
    activeChat: null, 
    activeChatLoading: false,
    activeChatSuccess: false,
    activeChatErrors: null,    

    fetchChatsLoading: false,
    fetchChatsSuccess: false,
    fetchChatsErrors: null,

    addChatRequestMessage: undefined,
    addChatLoading: false,
    addChatSuccess: false,
    addChatErrors: null,

    deleteChatLoading: false,
    deleteChatSuccess: false,
    deleteChatErrors: null
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
                activeChatSuccess: false
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
                newChat: false
            };

        case ADD_CHAT_FAILED:
            return {
                ...state,
                addChatLoading: false,
                addChatSuccess: false,
                addChatErrors: action.payload,
            };

        case UPDATE_CHAT_UPDATED_AT: {
            const chatToUpdateId = action.payload;
                
            const newUpdatedAt = new Date().toISOString(); // Example: "2023-04-03T18:27:13.485Z"
            
            // Using map to update the specific chat's updated_at field
            const updatedChats = state.chats.map(chat => {
                if (chat.id === chatToUpdateId) {
                    return { ...chat, updated_at: newUpdatedAt };
                }
                return chat; // Return chat unchanged if it's not the one to update
            });
            
            return {
                ...state,
                chats: updatedChats,
            };
        }
        
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
            
        default: return { ...state };
    }
}

export default Chat;