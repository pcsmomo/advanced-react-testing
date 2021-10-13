import { SagaIterator } from 'redux-saga';
import { call, cancel, cancelled, fork, put, take } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { StaticProvider, throwError } from 'redux-saga-test-plan/providers';

import { showToast } from '../../toast/redux/toastSlice';
import { authServerCall } from '../api';
import { LoggedInUser, SignInDetails } from '../types';
import {
  cancelSignIn,
  endSignIn,
  signIn,
  signInRequest,
  signOut,
  startSignIn,
} from './authSlice';
import { authenticateUser, signInFlow } from './signInSaga';

const signInRequestPayload: SignInDetails = {
  email: 'booker@avalancheofcheese.com',
  password: 'abc123',
  action: 'signIn',
};

const signUpRequestPayload: SignInDetails = {
  email: 'booker@avalancheofcheese.com',
  password: 'abc123',
  action: 'signUp',
};

const authServerResponse: LoggedInUser = {
  id: 123,
  email: 'booker@avalancheofcheese.com',
  token: '12345',
};

const sleep = (delay: number) =>
  new Promise((resolve) => setTimeout(resolve, delay));

const networkProviders: Array<StaticProvider> = [
  [matchers.call.fn(authServerCall), authServerResponse],
];

describe('signInFlow saga', () => {
  test('successful sign-in', () => {
    return expectSaga(signInFlow)
      .provide(networkProviders)
      .dispatch(signInRequest(signInRequestPayload))
      .fork(authenticateUser, signInRequestPayload)
      .put(startSignIn())
      .call(authServerCall, signInRequestPayload)
      .put(signIn(authServerResponse))
      .put(
        showToast({
          title: 'Signed in as booker@avalancheofcheese.com',
          status: 'info',
        })
      )
      .put(endSignIn())
      .silentRun(25);
    // .put.actionType(signIn(.type)) // partial assertion
    // .run(25) // there will be still warning message, but we don't need to wait whole 250ms, but only 25ms
  });
  test('successful sign-up', () => {
    return expectSaga(signInFlow)
      .provide(networkProviders)
      .dispatch(signInRequest(signUpRequestPayload))
      .fork(authenticateUser, signUpRequestPayload)
      .put(startSignIn())
      .call(authServerCall, signUpRequestPayload)
      .put(signIn(authServerResponse))
      .put(
        showToast({
          title: 'Signed in as booker@avalancheofcheese.com',
          status: 'info',
        })
      )
      .put(endSignIn())
      .silentRun(25);
  });
  test('canceled sign-in', () => {
    return expectSaga(signInFlow)
      .provide({
        call: async (effect, next) => {
          if (effect.fn === authServerCall) {
            await sleep(500);
          }
          next();
        },
      })
      .dispatch(signInRequest(signInRequestPayload))
      .fork(authenticateUser, signInRequestPayload)
      .dispatch(cancelSignIn())
      .put(showToast({ title: 'Sign in canceled', status: 'warning' }))
      .put(signOut())
      .put(endSignIn())
      .silentRun(25);
  });
  test('sign-in error', () => {
    return expectSaga(signInFlow)
      .provide([
        [
          matchers.call.fn(authServerCall),
          throwError(new Error('server is broken')),
        ],
      ])
      .dispatch(signInRequest(signInRequestPayload))
      .fork(authenticateUser, signInRequestPayload)
      .put(startSignIn())
      .put(
        showToast({
          title: 'Sign in failed: server is broken',
          status: 'warning',
        })
      )
      .put(endSignIn())
      .silentRun(25);
  });
});
