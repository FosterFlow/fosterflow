import {
	SET_LAYOUT_MODE
} from "./constants";

export const setLayoutMode = layoutMode => ({
	type: SET_LAYOUT_MODE,
	payload: layoutMode,
  });