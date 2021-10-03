import { PayloadAction } from '@reduxjs/toolkit';
import { SagaIterator } from 'redux-saga';
import { call, put, takeEvery } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';

import { ToastOptions } from '../types';
import { showToast } from './toastSlice';

import { logErrorToasts, logErrorToast } from './LogErrorToastSaga';

const errorToastOptions: ToastOptions = {
  title: "It's time to panic!!!!",
  status: 'error',
};

const errorToastAction = {
  type: 'test',
  payload: errorToastOptions,
};

test('saga caslls analytics when it receives error toast', () => {
  return expectSaga(logErrorToasts, errorToastAction)
    .call(logErrorToast, "It's time to panic!!!!")
    .run();
});

const infoToastOptions: ToastOptions = {
  title: "It's not time to panic",
  status: 'info',
};

const infoToastAction = {
  type: 'test',
  payload: infoToastOptions,
};

test('saga does not call analytics when it receives info toast', () => {
  return expectSaga(logErrorToasts, infoToastAction)
    .not.call(logErrorToast, "It's not time to panic")
    .run();
});
