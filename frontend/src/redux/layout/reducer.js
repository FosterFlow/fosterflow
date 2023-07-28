// @flow
import {
	SET_LANGUAGE,
	SET_LAYOUT_MODE
} from "./constants";

const INIT_STATE = {
	userSidebar : false,
	conversationName : "Doris Brown",
	layoutMode : localStorage.getItem("layoutMode") || "light",
	language : localStorage.getItem("language") || "en"
};

const Layout = (state = INIT_STATE, action) => {
	switch (action.type) {
		case SET_LAYOUT_MODE:
		return {
			...state,
			layoutMode: action.payload
		};
		case SET_LANGUAGE:
		return {
			...state,
			layoutMode: action.payload
		};
		default:
			return state;
	}
};

export default Layout;
