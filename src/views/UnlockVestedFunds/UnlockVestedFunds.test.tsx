import { render } from '../../testing/testing';
import { accountsMock } from '../../utilities/accounts/AccountsProvider.mock';

import { UnlockVestedFunds } from './UnlockVestedFunds';

describe('UnlockVestedFunds', () => {
  it('should render', async () => {
    const { container } = render(
      <UnlockVestedFunds
        account={
          accountsMock['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire']
        }
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
