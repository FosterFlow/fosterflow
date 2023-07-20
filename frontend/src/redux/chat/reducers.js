import {
    FETCH_DIALOGUES_REQUEST, FETCH_DIALOGUES_SUCCESS, ADD_DIALOGUE_SUCCESS, 
    DELETE_DIALOGUE_SUCCESS, FETCH_MESSAGES_REQUEST, FETCH_MESSAGES_SUCCESS, 
    ADD_MESSAGE_SUCCESS, DELETE_MESSAGE_SUCCESS, SET_ACTIVE_DIALOGUE, SHOW_CHAT_WINDOW, SET_ACTIVE_NEW_CHAT

} from './constants';

const INIT_STATE = {
  dialogues: [],
  messages: [],
  dialoguesLoading: true,
  activeDialogueId: 0,
  chatWindow: false,
  newChat: false
};

const Chat = (state = INIT_STATE, action) => {
  switch (action.type) {
    case SET_ACTIVE_DIALOGUE:
        return { 
            ...state,
            activeDialogueId: Number(action.payload)
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
    case FETCH_DIALOGUES_REQUEST:
    return { 
        ...state,
        dialoguesLoading: true
    };  
    case FETCH_DIALOGUES_SUCCESS:
        return { 
            ...state,
            dialogues: action.payload,
            dialoguesLoading: false
        };
    case ADD_DIALOGUE_SUCCESS:
        return { 
            ...state,
            dialogues: [...state.dialogues, action.payload],
            activeDialogueId: Number(action.payload.id),
            chatWindow: true,
            newChat: false
        };
    case DELETE_DIALOGUE_SUCCESS:
        return { 
            ...state,
            dialogues: state.dialogues.filter(dialogue => dialogue.id !== action.payload)
        };
          
    case FETCH_MESSAGES_REQUEST:
        return { 
            ...state,
            activeDialogueId: Number(action.payload)
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

    default: return { ...state };
  }
}

export default Chat;
