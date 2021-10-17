import { App } from '../../../App';
import { render, screen } from '../../../test-utils';

test('redirects to sign-in from /profile when not authenticated', () => {
  render(<App />, { routeHistory: ['/profile'] });
  const signInHeader = screen.getByRole('heading', { name: /sign/i });
  expect(signInHeader).toBeInTheDocument();
});
