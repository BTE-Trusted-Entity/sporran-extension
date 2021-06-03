import { render } from '../../testing/testing';

import { UnlockVestedFunds } from './UnlockVestedFunds';
import { accountsMock } from '../../utilities/accounts/AccountsProvider.mock';

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
