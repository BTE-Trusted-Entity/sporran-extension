import { render } from '../../testing';
import { paths } from '../../views/paths';

import { NEW } from '../../utilities/accounts/accounts';
import { AccountsCarousel } from './AccountsCarousel';

const accounts = {
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
};

describe('AccountsCarousel', () => {
  it('should render normal accounts', async () => {
    const { container } = render(
      <AccountsCarousel
        path={paths.account.overview}
        account={accounts['4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr']}
        accounts={accounts}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render the first account', async () => {
    const { container } = render(
      <AccountsCarousel
        path={paths.account.overview}
        account={accounts['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire']}
        accounts={accounts}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render the last account', async () => {
    const { container } = render(
      <AccountsCarousel
        path={paths.account.overview}
        account={accounts['4oyRTDhHL22Chv9T89Vv2TanfUxFzBnPeMuq4EFL3gUiHbtL']}
        accounts={accounts}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render the new account', async () => {
    const { container } = render(
      <AccountsCarousel
        path={paths.account.overview}
        account={NEW}
        accounts={accounts}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should support other paths', async () => {
    const { container } = render(
      <AccountsCarousel
        path={paths.account.send}
        account={accounts['4oyRTDhHL22Chv9T89Vv2TanfUxFzBnPeMuq4EFL3gUiHbtL']}
        accounts={accounts}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
