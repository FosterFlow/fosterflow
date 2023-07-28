import {
	SET_LANGUAGE,
	SET_LAYOUT_MODE
} from "./constants";

export const setLayoutMode = layoutMode => ({
	type: SET_LAYOUT_MODE,
	payload: layoutMode,
  });

  export const setLanguage = language => ({
	type: SET_LANGUAGE,
	payload: language,
  });