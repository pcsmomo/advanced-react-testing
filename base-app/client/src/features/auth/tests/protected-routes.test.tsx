import userEvent from '@testing-library/user-event';

import { App } from '../../../App';
import { render, screen } from '../../../test-utils';

test.each([
  { route: '/profile' },
  { route: '/tickets/0' },
  { route: '/confirm/0?holdId=123&seatCount=2' },
])('redirects to sign-in from $route when not authenticated', ({ route }) => {
  render(<App />, { routeHistory: [route] });
  const signInHeader = screen.getByRole('heading', { name: /sign/i });
  expect(signInHeader).toBeInTheDocument();
});

test('successful sign-in flow', () => {
  // go to protected page
  const { history } = render(<App />, { routeHistory: ['/tickets/1'] });

  // Sign in (after redirect)
  const emailField = screen.getByLabelText(/email/i);
  userEvent.type(emailField, 'booking@avalancheofcheese.com');

  const passwordField = screen.getByLabelText(/password/i);
  userEvent.type(passwordField, 'iheartcheese');

  const signInButton = screen.getByRole('button', { name: /sign in/i });
  userEvent.click(signInButton);

  // test redirect back to protected page
  expect(history.location.pathname).toBe('/tickets/1');

  // sign-in page remove from history
  console.log(history);
});
