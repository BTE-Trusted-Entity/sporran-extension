import { render, screen } from '../../testing/testing';

import { Balance } from './Balance';

describe('Balance', () => {
  it('should render', async () => {
    const address = '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire';
    const { container } = render(<Balance address={address} />);

    await screen.findByLabelText('Kilt coin');

    expect(container).toMatchSnapshot();
  });
});
