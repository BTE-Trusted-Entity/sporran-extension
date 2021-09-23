import { render } from '../../testing/testing';

import { hasVestedFunds } from '../../utilities/vesting/vesting';

import { BalanceUpdateLink } from './BalanceUpdateLink';

jest.mock('../../utilities/vesting/vesting');
(hasVestedFunds as jest.Mock).mockResolvedValue(false);

const mockAddress = '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire';

describe('BalanceUpdateLink', () => {
  it('should render', async () => {
    const { container } = render(<BalanceUpdateLink address={mockAddress} />);

    expect(container).toMatchSnapshot();
  });
});
