import { all, call } from "redux-saga/effects";

import { fetchCollectionsStart } from "./shop/shop.sagas";

export default function* rootSaga() {
  // all : https://redux-saga.js.org/docs/api/#alleffects---parallel-effects
  yield all([call(fetchCollectionsStart)]);
}
