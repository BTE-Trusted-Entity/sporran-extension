import {
  accountsMock as accounts,
  moreAccountsMock as moreAccounts,
  AccountsProviderMock,
  render,
  screen,
} from '../../testing';
import { paths } from '../../views/paths';

import { NEW } from '../../utilities/accounts/accounts';
import { waitForNextTartan } from '../../testing/getNextTartan.mock';

import { AccountsCarousel } from './AccountsCarousel';

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

  it('should render a bubble for each account', async () => {
    const { container } = render(
      <AccountsCarousel
        path={paths.account.overview}
        account={accounts['4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr']}
      />,
    );

    expect((await screen.findAllByLabelText('My Sporran Account')).length).toBe(
      2,
    );
    expect((await screen.findAllByLabelText('My Second Account')).length).toBe(
      1,
    );
    expect((await screen.findAllByLabelText('My Third Account')).length).toBe(
      2,
    );

    expect(container).toMatchSnapshot();
  });
  it('should not render bubbles if number of accounts is more than the maximum', async () => {
    const { container } = render(
      <AccountsProviderMock accounts={moreAccounts}>
        <AccountsCarousel
          path={paths.account.overview}
          account={
            moreAccounts['4ruKeJZXBuqvgTvsTpbsG1RChkTsdz1TDMGgFP7SYykK78R8']
          }
        />
      </AccountsProviderMock>,
    );
    expect(screen.queryByLabelText('My First Account')).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText('My Second Account'),
    ).not.toBeInTheDocument();
    expect(screen.queryByLabelText('My Sixth Account')).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText('Create new account'),
    ).not.toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });
});
