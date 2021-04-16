import { accountsMock as accounts, render } from '../../testing';
import { paths } from '../../views/paths';

import { NEW } from '../../utilities/accounts/accounts';
import { AccountsCarousel } from './AccountsCarousel';
import { waitForNextTartan } from '../../testing/getNextTartan.mock';

describe('AccountsCarousel', () => {
  it('should render normal accounts', async () => {
    const { container } = render(
      <AccountsCarousel
        path={paths.account.overview}
        account={accounts['4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr']}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render the first account', async () => {
    const { container } = render(
      <AccountsCarousel
        path={paths.account.overview}
        account={accounts['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire']}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render the last account', async () => {
    const { container } = render(
      <AccountsCarousel
        path={paths.account.overview}
        account={accounts['4oyRTDhHL22Chv9T89Vv2TanfUxFzBnPeMuq4EFL3gUiHbtL']}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render the new account', async () => {
    const { container } = render(
      <AccountsCarousel path={paths.account.overview} account={NEW} />,
    );
    await waitForNextTartan();
    expect(container).toMatchSnapshot();
  });

  it('should support other paths', async () => {
    const { container } = render(
      <AccountsCarousel
        path={paths.account.send}
        account={accounts['4oyRTDhHL22Chv9T89Vv2TanfUxFzBnPeMuq4EFL3gUiHbtL']}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
