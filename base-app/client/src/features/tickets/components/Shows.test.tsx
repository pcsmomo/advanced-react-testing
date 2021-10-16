import {
  fireEvent,
  getByRole,
  getByText,
  render,
  screen,
} from '../../../test-utils';
import { Shows } from './Shows';

// name: 'Avalanche of Cheese',
// description: 'rollicking country with ambitious kazoo solos',

test('displays relavant show details for non-sold-out show', async () => {
  render(<Shows />);
  const shows = await screen.findAllByRole('listitem');
  const nonSoldOutShow = shows[0];

  const ticketButton = getByRole(nonSoldOutShow, 'button', {
    name: /tickets/i,
  });
  expect(ticketButton).toBeInTheDocument();

  const bandName = getByRole(nonSoldOutShow, 'heading', {
    name: /avalanche of cheese/i,
  });
  expect(bandName).toBeInTheDocument();

  const bandDescription = getByText(
    nonSoldOutShow,
    'rollicking country with ambitious kazoo solos'
  );
  expect(bandDescription).toBeInTheDocument();
});

test('displays relavant show details for sold-out show', async () => {
  render(<Shows />);
  const shows = await screen.findAllByRole('listitem');
  const soldOutShow = shows[1];

  const soldOutMessage = getByRole(soldOutShow, 'heading', {
    name: /sold out/i,
  });
  expect(soldOutMessage).toBeInTheDocument();

  const bandName = getByRole(soldOutShow, 'heading', {
    name: /the joyous nun riot/i,
  });
  expect(bandName).toBeInTheDocument();

  const bandDescription = getByText(
    soldOutShow,
    'serious world music with an iconic musical saw'
  );
  expect(bandDescription).toBeInTheDocument();
});

// Unit test
test("redirects to correct tickets URL when 'tickets is clicked", async () => {
  const { history } = render(<Shows />);

  const ticketsButton = await screen.findByRole('button', {
    name: /tickets/i,
  });
  fireEvent.click(ticketsButton);

  expect(history.location.pathname).toBe('/tickets/0');
});
