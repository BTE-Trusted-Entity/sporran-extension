import userEvent from '@testing-library/user-event';

import { render, screen } from '../../testing';
import { useAccounts } from '../../utilities/accounts/accounts';
import { AddAccount } from './AddAccount';

jest.mock('../../utilities/accounts/accounts');
(useAccounts as jest.Mock).mockImplementation(() => ({
  data: {
    '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire': {
      name: 'My Sporran Account',
      address: '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire',
      index: 1,
    },
    '4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr': {
      name: 'My Second Account',
      address: '4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr',
      index: 2,
    },
    '4oyRTDhHL22Chv9T89Vv2TanfUxFzBnPeMuq4EFL3gUiHbtL': {
      name: 'My Third Account',
      address: '4oyRTDhHL22Chv9T89Vv2TanfUxFzBnPeMuq4EFL3gUiHbtL',
      index: 3,
    },
  },
}));

describe('AddAccount', () => {
  it('should render', async () => {
    const { container } = render(<AddAccount />);
    expect(container).toMatchSnapshot();
  });

  it('menu should be visible when menu button clicked', async () => {
    const { container } = render(<AddAccount />);
    const openMenuButton = await screen.findByLabelText('Add account');
    expect(openMenuButton).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    userEvent.click(openMenuButton);

    expect(await screen.findByRole('menu')).toBeInTheDocument();
    expect(openMenuButton).toHaveAttribute('aria-expanded', 'true');

    expect(container).toMatchSnapshot();
  });
});
