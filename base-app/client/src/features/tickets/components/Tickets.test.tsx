import { App } from '../../../App';
import { render, screen } from '../../../test-utils';

test('tickets page displays band data for showId', async () => {
  render(<App />, {
    preloadedState: { user: { userDetails: { email: 'test@test.com ' } } },
    routeHistory: ['/tickets/0'],
  });
  const heading = await screen.findByRole('heading', {
    name: /Avalanche of Cheese/i,
  });
  expect(heading).toBeInTheDocument();

  // more tests here
});
