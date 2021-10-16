import { App } from '../../../App';
import { render, screen } from '../../../test-utils';

test('home page does not redirect to login screen', () => {
  render(<App />); // don't need to specify route
  const homeHeading = screen.getByRole('heading', { name: /welcome/i });
  expect(homeHeading).toBeInTheDocument();
});
