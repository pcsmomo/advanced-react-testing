import userEvent from '@testing-library/user-event';
import {
  DefaultRequestBody,
  RequestParams,
  ResponseComposition,
  rest,
  RestContext,
  RestRequest,
} from 'msw';

import { App } from '../../../App';
import { baseUrl, endpoints } from '../../../app/axios/constants';
import { handlers } from '../../../mocks/handlers';
import { server } from '../../../mocks/server';
import { getByRole, render, screen, waitFor } from '../../../test-utils';

test.each([
  { route: '/profile' },
  { route: '/tickets/0' },
  { route: '/confirm/0?holdId=123&seatCount=2' },
])('redirects to sign-in from $route when not authenticated', ({ route }) => {
  render(<App />, { routeHistory: [route] });
  const signInHeader = screen.getByRole('heading', { name: /sign/i });
  expect(signInHeader).toBeInTheDocument();
});

test.each([
  { testName: 'sign in', buttonName: /sign in/i },
  { testName: 'sign up', buttonName: /sign up/i },
])('successful $testName flow', async ({ buttonName }) => {
  // go to protected page
  const { history } = render(<App />, { routeHistory: ['/tickets/1'] });

  // Sign in (after redirect)
  const emailField = screen.getByLabelText(/email/i);
  userEvent.type(emailField, 'booking@avalancheofcheese.com');

  const passwordField = screen.getByLabelText(/password/i);
  userEvent.type(passwordField, 'iheartcheese');

  const signInForm = screen.getByTestId('sign-in-form');
  const signInButton = getByRole(signInForm, 'button', { name: buttonName });
  userEvent.click(signInButton);

  await waitFor(() => {
    // test redirect back to protected page
    expect(history.location.pathname).toBe('/tickets/1');

    // sign-in page remove from history
    expect(history.entries).toHaveLength(1);
  });
});

const signInFailure = (
  req: RestRequest<DefaultRequestBody, RequestParams>,
  res: ResponseComposition,
  ctx: RestContext
) => res(ctx.status(401));

// const signInError = (
//   req: RestRequest<DefaultRequestBody, RequestParams>,
//   res: ResponseComposition,
//   ctx: RestContext
// ) => res(ctx.status(500));

const serverError = (
  req: RestRequest<DefaultRequestBody, RequestParams>,
  res: ResponseComposition,
  ctx: RestContext
) => res(ctx.status(500));

const signUpFailure = (
  req: RestRequest<DefaultRequestBody, RequestParams>,
  res: ResponseComposition,
  ctx: RestContext
) => res(ctx.status(400), ctx.json({ message: 'Email is already in use' }));

test.each([
  {
    endpoint: endpoints.signIn,
    outcome: 'failure',
    responseResolver: signInFailure,
    buttonNameRegex: /sign in/i,
  },
  {
    endpoint: endpoints.signIn,
    outcome: 'error',
    responseResolver: serverError,
    buttonNameRegex: /sign in/i,
  },
  {
    endpoint: endpoints.signUp,
    outcome: 'failure',
    responseResolver: signUpFailure,
    buttonNameRegex: /sign up/i,
  },
  {
    endpoint: endpoints.signUp,
    outcome: 'error',
    responseResolver: serverError,
    buttonNameRegex: /sign up/i,
  },
])(
  '$endpoint $outcome followed by success',
  async ({ endpoint, responseResolver, buttonNameRegex }) => {
    // reset the handler to respond unsuccessfully
    const errorHandler = rest.post(`${baseUrl}/${endpoint}`, responseResolver);
    // server.resetHandlers(...handlers, errorHandler);
    server.resetHandlers(errorHandler);

    // go to protected page
    const { history } = render(<App />, { routeHistory: ['/tickets/1'] });

    // Sign in (after redirect)
    const emailField = screen.getByLabelText(/email/i);
    userEvent.type(emailField, 'booking@avalancheofcheese.com');

    const passwordField = screen.getByLabelText(/password/i);
    userEvent.type(passwordField, 'iheartcheese');

    const actionForm = screen.getByTestId('sign-in-form');
    const actionButton = getByRole(actionForm, 'button', {
      name: buttonNameRegex,
    });
    userEvent.click(actionButton);

    // Reset to original one
    server.resetHandlers();
    userEvent.click(actionButton);

    await waitFor(() => {
      // test redirect back to protected page
      expect(history.location.pathname).toBe('/tickets/1');

      // sign-in page remove from history
      expect(history.entries).toHaveLength(1);
    });
  }
);

// test('unsuccessful signin followed by successful signin', async () => {
//   const errorHandler = rest.post(
//     `${baseUrl}/${endpoints.signIn}`,
//     signInFailure
//   );
//   server.resetHandlers(errorHandler);

//   // go to protected page
//   const { history } = render(<App />, { routeHistory: ['/tickets/1'] });

//   // Sign in (after redirect)
//   const emailField = screen.getByLabelText(/email/i);
//   userEvent.type(emailField, 'booking@avalancheofcheese.com');

//   const passwordField = screen.getByLabelText(/password/i);
//   userEvent.type(passwordField, 'iheartcheese');

//   const signInForm = screen.getByTestId('sign-in-form');
//   const signInButton = getByRole(signInForm, 'button', { name: /sign in/i });
//   userEvent.click(signInButton);

//   // Reset to original one
//   server.resetHandlers();
//   userEvent.click(signInButton);

//   await waitFor(() => {
//     // test redirect back to protected page
//     expect(history.location.pathname).toBe('/tickets/1');

//     // sign-in page remove from history
//     expect(history.entries).toHaveLength(1);
//   });
// });

// test('signin server error followed by successful signin', async () => {
//   const errorHandler = rest.post(`${baseUrl}/${endpoints.signIn}`, signInError);
//   server.resetHandlers(errorHandler);

//   // go to protected page
//   const { history } = render(<App />, { routeHistory: ['/tickets/1'] });

//   // Sign in (after redirect)
//   const emailField = screen.getByLabelText(/email/i);
//   userEvent.type(emailField, 'booking@avalancheofcheese.com');

//   const passwordField = screen.getByLabelText(/password/i);
//   userEvent.type(passwordField, 'iheartcheese');

//   const signInForm = screen.getByTestId('sign-in-form');
//   const signInButton = getByRole(signInForm, 'button', { name: /sign in/i });
//   userEvent.click(signInButton);

//   // Reset to original one
//   server.resetHandlers();
//   userEvent.click(signInButton);

//   await waitFor(() => {
//     // test redirect back to protected page
//     expect(history.location.pathname).toBe('/tickets/1');

//     // sign-in page remove from history
//     expect(history.entries).toHaveLength(1);
//   });
// });
