import { App } from '../../../App';
import { render, screen } from '../../../test-utils';
import { UserProfile } from './UserProfile';

const testUser = {
  email: 'booking@avalancheofcheese.com',
};

test('greets the user', () => {
  render(<UserProfile />, {
    preloadedState: { user: { userDetails: testUser } },
  });
  expect(
    screen.getByText(/hi, booking@avalancheofcheese.com/i)
  ).toBeInTheDocument();
});

test('redirects to signin if user is falsy', () => {
  const { history } = render(<UserProfile />);
  // console.log(history);
  expect(history.location.pathname).toBe('/signin');
});

// Behaviour test
test('view sign-in page when loading profile while not logging in', () => {
  render(<App />, { routeHistory: ['/profile'] });
  const heading = screen.getByRole('heading', {
    name: /Sign in to your account/i,
  });
  expect(heading).toBeInTheDocument();
});
