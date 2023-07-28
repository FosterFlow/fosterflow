// @flow
import { all, call, fork, takeEvery } from "redux-saga/effects";

import { SET_LAYOUT_MODE, SET_LANGUAGE } from "./constants";

/**
 * TODO: move to component attribute
 * Changes the body attribute
 */
function changeBodyAttribute(attribute, value) {
  if (document.body) document.body.setAttribute(attribute, value);
  return true;
}

/**
 * Changes the layout mode
 */
function* setLayoutMode({ payload:  layoutMode  }) {
  try {
    if (layoutMode === "light") {
      yield call(changeBodyAttribute, "data-bs-theme", layoutMode);
      localStorage.setItem("layoutMode", layoutMode);
    } else if (layoutMode === "dark") {
      yield call(changeBodyAttribute, "data-bs-theme", layoutMode);
      localStorage.setItem("layoutMode", layoutMode);
    }
  } catch (error) { 
    //TODO: add error handler
    console.log ("saga setLayoutMode error", error);
  }
}

/**
 * Changes the language
 */
function* setLanguage({ payload:  language  }) {
  try {
      localStorage.setItem("language", language);
    } catch (error) { 
      //TODO: add error handler
      console.log ("saga setLanguage error", error);
    }
}

/**
 * Watchers
 */
export function* watchLayoutParams() {
  yield takeEvery(SET_LAYOUT_MODE, setLayoutMode);
  yield takeEvery(SET_LANGUAGE, setLanguage);
}

function* LayoutSaga() {
  yield all([
    fork(watchLayoutParams)
  ]);
}

export default LayoutSaga;
