import { render } from '../../testing/testing';

import { BalanceUpdateLink } from './BalanceUpdateLink';

const mockAddress = '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire';

describe('BalanceUpdateLink', () => {
  it('should render', async () => {
    const { container } = render(<BalanceUpdateLink address={mockAddress} />);

    expect(container).toMatchSnapshot();
  });
});
