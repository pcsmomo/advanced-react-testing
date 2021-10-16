import { App } from '../../../App';
import { fireEvent, render, screen } from '../../../test-utils';

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

test("'purchase' button pushes the correct URL", async () => {
  const { history } = render(<App />, {
    preloadedState: { user: { userDetails: { email: 'test@test.com ' } } },
    routeHistory: ['/tickets/0'],
  });

  const purchaseButton = await screen.findByRole('button', {
    name: /purchase/i,
  });
  fireEvent.click(purchaseButton);
  // console.log(history);
  // location: {
  //   pathname: '/confirm/0',
  //   search: '?holdId=37376094&seatCount=2',
  //   hash: '',
  //   state: undefined,
  //   key: 'ikkyc6'
  // },

  expect(history.location.pathname).toBe('/confirm/0');

  const searchRegex = expect.stringMatching(/holdId=\d+&seatCount=2/);
  // console.log(searchRegex);
  // StringMatching {
  //   sample: /holdId=\d+&seatCount=2/,
  //   '$$typeof': Symbol(jest.asymmetricMatcher),
  //   inverse: false
  // }

  expect(history.location.search).toEqual(searchRegex);
});
