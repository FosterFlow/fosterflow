import {
	OPEN_USER_PROFILE_SIDEBAR,
	CLOSE_USER_PROFILE_SIDEBAR,
	SET_CONVERSATION_NAME_IN_OPEN_CHAT,
	SET_LAYOUT_MODE
} from "./constants";

export const openUserSidebar = () => ({
	type: OPEN_USER_PROFILE_SIDEBAR
});

export const closeUserSidebar = () => ({
	type: CLOSE_USER_PROFILE_SIDEBAR
});

export const setconversationNameInOpenChat = (conversationName) => ({
	type: SET_CONVERSATION_NAME_IN_OPEN_CHAT,
	payload: conversationName
});

export const setLayoutMode = layoutMode => ({
	type: SET_LAYOUT_MODE,
	payload: layoutMode,
  });