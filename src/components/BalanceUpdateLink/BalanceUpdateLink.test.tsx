import { render } from '../../testing/testing';

import { useAsyncValue } from '../../utilities/useAsyncValue/useAsyncValue';

import { BalanceUpdateLink } from './BalanceUpdateLink';

jest.mock('../../utilities/useAsyncValue/useAsyncValue');
jest.mocked(useAsyncValue).mockReturnValue(false);

const mockAddress = '4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1';

describe('BalanceUpdateLink', () => {
  it('should render', async () => {
    const { container } = render(<BalanceUpdateLink address={mockAddress} />);

    expect(container).toMatchSnapshot();
  });
});
