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
