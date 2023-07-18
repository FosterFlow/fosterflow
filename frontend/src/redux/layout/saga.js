// @flow
import { all, call, fork, takeEvery } from "redux-saga/effects";

import { SET_LAYOUT_MODE, GET_LAYOUT_MODE } from "./constants";

/**
 * TODO: move to component attribute
 * Changes the body attribute
 */
function changeBodyAttribute(attribute, value) {
  if (document.body) document.body.setAttribute(attribute, value);
  return true;
}

function* getLayoutMode() {
  return localStorage.getItem("layoutMode");
}

/**
 * Changes the layout mode
 * @param {*} param0
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
  } catch (error) { }
}

/**
 * Watchers
 */
export function* watchSetLayoutMode() {
  yield takeEvery(SET_LAYOUT_MODE, setLayoutMode);
}

export function* watchGetLayoutMode() {
  yield takeEvery(GET_LAYOUT_MODE, getLayoutMode);
}

function* LayoutSaga() {
  yield all([
    fork(watchSetLayoutMode),
    fork(watchGetLayoutMode)
  ]);
}

export default LayoutSaga;
