import { render } from '../../testing/testing';
import { paths, generatePath } from '../paths';
import { accountsMock as accounts } from '../../utilities/accounts/AccountsProvider.mock';

import { ExistentialWarning } from './ExistentialWarning';

const account = accounts['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'];

const signTransferTxPath = generatePath(paths.account.send.review, {
  address: account.address,
});

describe('ExistentialWarning', () => {
  it('should render with link to sign transfer screen', async () => {
    const { container } = render(
      <ExistentialWarning nextPath={signTransferTxPath} />,
    );

    expect(container).toMatchSnapshot();
  });
});
