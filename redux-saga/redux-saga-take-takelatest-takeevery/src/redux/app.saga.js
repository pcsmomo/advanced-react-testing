import { take, takeEvery, takeLatest, delay, put } from "redux-saga/effects";

export function* onIncrement() {
  yield console.log("I am incremented");
  yield delay(3000); // it doesn't block next event of onIncrement()
  yield put({ type: "INCREMENT_FROM_SAGA" });
}

// export function* incrementSagaTakeEvery() {
//   yield takeEvery("INCREMENT", onIncrement);
// }

/** takeLatest
 * with many click event,
 * onIncrement will be fired, but if new event occurs before onIncrement finishes,
 * it takes only the last event
 */
export function* incrementSaga() {
  yield takeLatest("INCREMENT", onIncrement);
}

/* take with while
 * This looks similar with takeEvery
 * But it is hung on delay(), unlike takeEvery which creates new
 */
// export function* incrementSagaTakeWhile() {
//   while (true) {
//     yield take("INCREMENT");
//     yield console.log("I am incremented");
//     yield delay(5000);
//   }
// }

/** take */
// export function* incrementSagaTake() {
//   yield take("INCREMENT");
//   console.log("I am incremented");
// }
