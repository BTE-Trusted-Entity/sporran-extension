import { render } from '../../testing/testing';
import { paths, generatePath } from '../paths';
import { accountsMock as accounts } from '../../utilities/accounts/AccountsProvider.mock';

import { ExistentialWarning } from './ExistentialWarning';

const account = accounts['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'];

const signTransferTxPath = generatePath(paths.account.send.review, {
  address: account.address,
});

const signVestingTxPath = generatePath(paths.account.vest.sign, {
  address: account.address,
});

describe('ExistentialWarning', () => {
  it('should render with link to sign transfer screen', () => {
    const { container } = render(
      <ExistentialWarning path={signTransferTxPath} />,
    );
    expect(container).toMatchSnapshot();
  });
  it('should render with link to sign vesting screen', () => {
    const { container } = render(
      <ExistentialWarning path={signVestingTxPath} />,
    );
    expect(container).toMatchSnapshot();
  });
});
