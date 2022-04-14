import { act, render } from '../../testing/testing';

import { hasVestedFunds } from '../../utilities/vesting/vesting';

import { BalanceUpdateLink } from './BalanceUpdateLink';

jest.mock('../../utilities/vesting/vesting');
jest.mocked(hasVestedFunds).mockResolvedValue(false);

const mockAddress = '4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1';

describe('BalanceUpdateLink', () => {
  it('should render', async () => {
    const { container } = render(<BalanceUpdateLink address={mockAddress} />);

    await act(async () => {
      await hasVestedFunds(mockAddress);
    });

    expect(container).toMatchSnapshot();
  });
});
