import { render, screen, waitFor } from '../../testing/testing';

import { AppSettings } from './AppSettings';

describe('AppSettings', () => {
  it('should render', async () => {
    const { container } = render(<AppSettings />);

    await waitFor(async () => {
      const endpoint = (await screen.getByRole('combobox')) as HTMLInputElement;
      return endpoint.value !== '';
    });

    expect(container).toMatchSnapshot();
  });
});
