import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import logger from "redux-logger";

import rootReducer from "./root-reducer";

import { incrementSaga } from "./app.saga";
// import {
//   incrementSagaTake,
//   incrementSagaTakeWhile,
//   incrementSagaTakeEvery,
//   incrementSagaTakeLatest,
// } from "./app.saga";

const sagaMiddleware = createSagaMiddleware();

const middlewares = [logger, sagaMiddleware];

export const store = createStore(rootReducer, applyMiddleware(...middlewares));

sagaMiddleware.run(incrementSaga);
// sagaMiddleware.run(incrementSagaTake);
// sagaMiddleware.run(incrementSagaTakeWhile);
// sagaMiddleware.run(incrementSagaTakeEvery);
// sagaMiddleware.run(incrementSagaTakeLatest);

export default store;
