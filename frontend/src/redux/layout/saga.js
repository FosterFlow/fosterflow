// @flow
import { all, call, fork, takeEvery } from "redux-saga/effects";

import { SET_LAYOUT_MODE } from "./constants";

/**
 * Changes the body attribute
 */
function changeBodyAttribute(attribute, value) {
  if (document.body) document.body.setAttribute(attribute, value);
  return true;
}

/**
 * Changes the layout mode
 * @param {*} param0
 */
 function* changelayoutMode({ payload:  layoutMode  }) {
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
export function* watchChangelayoutMode() {
  yield takeEvery(SET_LAYOUT_MODE, changelayoutMode);
}

function* LayoutSaga() {
  yield all([
    fork(watchChangelayoutMode),
  ]);
}

export default LayoutSaga;
