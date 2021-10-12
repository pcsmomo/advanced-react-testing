import { SagaIterator } from 'redux-saga';
import { call, cancel, cancelled, fork, put, take } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { StaticProvider } from 'redux-saga-test-plan/providers';

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
  test.todo('canceled sign-in');
  test.todo('sign-in error');
});
