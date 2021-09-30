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
- [redux-saga-test-plan doc](http://redux-saga-test-plan.jeremyfairbank.com/)
- Integration testing
  - run the saga as a whole
  - assert on effects (e.g. put or call)
- Unit testing
  - run the saga step-by-step
  - assert on effects AND order
- We will mostly integration testing in this course
  - unit tests for fork cancel, not possible in integration

</details>
