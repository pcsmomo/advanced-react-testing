# advanced-react-testing

Advanced React Testing: Redux Saga and React Router by Bonnie Schulkin

## Details

<details open> 
  <summary>Click to Contract/Expend</summary>

## Section 1: Introduction

### 2. Popular Music Venue app

1. Server
   - Express server
   - Auth done via JWT
   - Privdes data for shows and bands
     - Records ticket purchases
   - Not testing server at all
     - Mock Service Worker for server responses in tests
2. Client
   - Create React App
   - TypeScript
   - Redux Toolkit
   - Redux Saga
   - React Router
   - Chakra UI
   - Jest
   - Testing Library

## Section 2: Using redux-saga-test-plan

### 5. Introduction to Testing Redux Sagas

#### Testing Implementation Details

1. Testing Sagas is testing implementation details
   - Not testing app the way a user would
   - Testing code, not app behavior
2. Good idea for complicated sagas
   - redux-saga is known for testability
   - "Testing implementation" tradeoffs:
     - diagnosis is easier; test maintenance is harder
   - Help diagnose behavior-based("functional") tests
3. These tests are not for behavioral testing purists

#### Three Saga Sections

1. This section: intro to redux-saga-test-plan syntax
2. Next section: complex _ticketFlow_ saga
   - controlled by _takeEvery_
3. Last section: _signInFlow_ saga with fork
   - controlled by infinite _while_ loop

### 6. Introduction to redux-saga-test-plan

- [Several options for saga test libraries](https://redux-saga.js.org/docs/advanced/Testing/)
- [redux-saga-test-plan doc](https://redux-saga-test-plan.jeremyfairbank.com/)
- Integration testing
  - run the saga as a whole
  - assert on effects (e.g. put or call)
- Unit testing
  - run the saga step-by-step
  - assert on effects AND order
- We will mostly integration testing in this course
  - unit tests for fork cancel, not possible in integration

---

> I've decided to go the "Redux Saga" part through once more

## Complete React Developer - Redux Saga

### 195. Generator Functions

```js
function* genC(i) {
  yield i;
  yield i + 10;
  return 25;
}
const gB = gen(5);
gB.next();
// { value: 5, done: false }
gB.next();
// { value: 15, done: false }
gB.next();
// { value: 25, done: true }
```

> Thinking of it as: \
> Ability to "pause" functions

### 197. redux-saga

```sh
npm install --save redux-saga
```

### 198. Redux Thunk Into Saga

```js
// shop.sagas.js
import { take, takeEvery, takeLatest, delay, put } from "redux-saga/effects";

export function* onIncrement() {
  yield console.log("I am incremented");
  yield delay(3000); // it doesn't block next event of onIncrement()
  yield put({ type: "INCREMENT_FROM_SAGA" });
}

export function* incrementSagaTakeEvery() {
  yield takeEvery("INCREMENT", onIncrement);
}

/** takeLatest
 * with many click event,
 * onIncrement will be fired, but if new event occurs before onIncrement finishes,
 * it takes only the last event
 */
export function* incrementSagaTakeLatest() {
  yield takeLatest("INCREMENT", onIncrement);
}

/* take with while
 * This looks similar with takeEvery
 * But it is hung on delay(), unlike takeEvery which creates new
 */
export function* incrementSagaTakeWhile() {
  while (true) {
    yield take("INCREMENT");
    yield console.log("I am incremented");
    yield delay(5000);
  }
}

/** take */
export function* incrementSagaTake() {
  yield take("INCREMENT");
  console.log("I am incremented");
}
```

### 200. Root Saga

```js
// root-saga.js
import { all, call } from "redux-saga/effects";
import { fetchCollectionsStart } from "./shop/shop.sagas";

export default function* rootSaga() {
  // all : https://redux-saga.js.org/docs/api/#alleffects---parallel-effects
  yield all([call(fetchCollectionsStart)]);
}
```

---

### 10. Partial Assertions

[redux-saga-test-plan : Partial Assertions - Helper Methods](https://redux-saga-test-plan.jeremyfairbank.com/integration-testing/partial-matching.html)

### 11. Review: redux-saga-test-plan Introduction

- Integration testing (We will do mostly integration testing)
  - Run entire saga
  - Tools like mocks and partial matchers
- Unit testing (It will be introduced at the end of this course)
  - Run saga step-by-step
  - Assert on effects AND order
- _redux-saga-test-plan_ syntax
  - _return / await expectSaga_
  - _[.not].effect()_ for assertions
  - Partial assertions, such as _.call.fn()_
  - _.run()_ for running the saga

### 14. Error from not Returning `expectSaga`

```js
expectSaga(ticketFlow, holdAction);
return expectSaga(ticketFlow, holdAction);
```

What happens if you don't return? -> It will always pass (=fault positive)

- Without return expectSaga() or await expectSaga()
- Test function starts async expectSaga call
  - Exits before promise resolves
- Assertions run after promise resolves
  - After test has already passed

test function starts -> async call -> test function complets without error -> promise resolves -> assertions run

### 15. Mocking with `.provide()` method

_provide()_ Syntax

- Static vs. dynamic
  - static: array of tuples _[matcher, mock value]_
  - dynamic: object liternal, _{ matcher: (effect, next) => {} }_
- We will be using mostly static
  - Dynamic: _race_ isn't available for static, making an effect take longer
- Matchers: https://redux-saga-test-plan.jeremyfairbank.com/integration-testing/mocking/static-providers.html

### 20. Code Quiz! Purchase Error

- Pass _ticketFlow_ to _expectSaga_
- Mock similar to last error thrown test (network providers, selector, override)
- Provider that throws error, use _matchers.call.like_:
  ```js
  matchers.call.like({
    fn: reserveTicketServerCall,
    args: [purchaseReservation], // not holdReservation!
  });
  ```
- Dispatch this action to trigger _purchaseTickets_ saga:
  `startTicketPurchase(purchasePayload)`
- Assertions similar to last error thrown test

### 23. OPTIONAL Code Quiz! Successful Purchase

- All of these effects happen in _purchaseTicket_ saga
  - Plus assert on _cancelSource.cancel_ call from _cancelSource_ argument
- No need for _race()_ provider here (just let the purchase win)
- Provide all network mocks
- Approaches
  - Use previous tests as a guide, or
  - More challenging: write without looking at previous tests
  - Strong recommendation against copy/paste

### 24. OPTIONAL Code Quiz! Hold Cancel

Technical Notes

- Dispatch this action for "cancel":
  - `startTicketRelease({ reservation: holdReservation, reason: "test" })`
- Dispatch this action for "abort":
  - `startTicketAbort({ reservation: holdReservation, reason: "test" })`
- Cancellation toast will look like this:
  - `startToast({ title: "test", status: "warning" })`

### 25. Parametrization with 'test.each()'

test.each([argument object]) (test name, test function)

### 26. Review: Complex takeEvery Saga Tests

- more _redux-saga-test-plan_ syntax
  - _.provide()_ for mocking
    - _throwError()_ value for throwing Error
  - _.dispatch()_ for dispatching actions after start
  - dynamic provider for _race_ effect
- jest's _test.each()_ for parametrizing tests

### 27. Introduction to Sign In Sagas

- Watcher: _while_ loop with cancel-able _fork_
  - cancel sign in if user navigates away from server returns
- Slice manages _status_ piece of state (values: _idle_, _pending_)
- Saga only manages sign in
  - sign out doesn't have cancellation controls
- Sign-in vs Sign-up

### 28. Set Up signInSaga Test File

test.todo()\
`test.todo('successful sign-in');`

### 29. Testing Successful Sign-in: .silentRun and Timeout

There will be a warning message because signInFlow() has infinite loop.

```sh
console.warn
    [WARNING]: Saga exceeded async timeout of 25ms
```

Not to see this error, use `silentRun()` instead of `run()`

### 31. Code Quiz! Sign Up Flow

- Virtually identical to sign in flow
  - only difference: payload to _signInRequest_
  - actual code path diverges in call to the server
- Worth including the test?
  - probably not as a saga test
  - maybe in e2e testing, check that the user was created

</details>
