// @flow
import {
	OPEN_USER_PROFILE_SIDEBAR,
	CLOSE_USER_PROFILE_SIDEBAR,
	SET_CONVERSATION_NAME_IN_OPEN_CHAT,
	SET_LAYOUT_MODE
} from "./constants";

const INIT_STATE = {
	userSidebar : false,
	conversationName : "Doris Brown",
	layoutMode : localStorage.getItem("layoutMode") || "light"
};

const Layout = (state = INIT_STATE, action) => {
	switch (action.type) {
		case OPEN_USER_PROFILE_SIDEBAR:
			return {
				...state,
				userSidebar: true
			};

		case CLOSE_USER_PROFILE_SIDEBAR:
			return {
				...state,
				userSidebar: false
			};

		case SET_CONVERSATION_NAME_IN_OPEN_CHAT:
			return {
				...state,
				conversationName: action.payload
			};

		case SET_LAYOUT_MODE:
		return {
			...state,
			layoutMode: action.payload
		};
		default:
			return state;
	}
};

export default Layout;
