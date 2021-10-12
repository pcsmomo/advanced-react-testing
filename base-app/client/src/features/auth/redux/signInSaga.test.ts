import { SagaIterator } from 'redux-saga';
import { call, cancel, cancelled, fork, put, take } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';

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

describe('signInFlow saga', () => {
  test.todo('successful sign-in');
  test.todo('successful sign-up');
  test.todo('canceled sign-in');
  test.todo('sign-in error');
});
