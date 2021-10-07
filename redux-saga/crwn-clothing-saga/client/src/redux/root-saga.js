import { all, call } from "redux-saga/effects";

import { fetchCollectionsStart } from "./shop/shop.sagas";
import { userSagas } from "./user/user.sagas";

export default function* rootSaga() {
  // all : https://redux-saga.js.org/docs/api/#alleffects---parallel-effects
  yield all([call(fetchCollectionsStart), call(userSagas)]);
}
