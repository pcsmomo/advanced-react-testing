import userEvent from '@testing-library/user-event';

import { App } from '../../../App';
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
