import { App } from '../../../App';
import { fireEvent, render, screen } from '../../../test-utils';
import { NavBar } from './NavBar';

// Unit test
test("Clicing sign-in button pushes '/signin' to history", () => {
  const { history } = render(<NavBar />);

  const signInButton = screen.getByRole('button', { name: /sign in/i });
  fireEvent.click(signInButton);

  expect(history.location.pathname).toBe('/signin');
});

// Behavior test
test('Clicking sign-in button shows sign-in page', () => {
  render(<App />);

  const signInButton = screen.getByRole('button', { name: /sign in/i });
  fireEvent.click(signInButton);

  expect(
    screen.getByRole('heading', { name: /Sign in to your account/i })
  ).toBeInTheDocument();
});
