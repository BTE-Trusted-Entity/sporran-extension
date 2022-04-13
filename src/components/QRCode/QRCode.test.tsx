import { render } from '../../testing/testing';

import { QRCode } from './QRCode';

describe('QRCode', () => {
  it('should render', async () => {
    const { container } = render(
      <QRCode address="4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1" />,
    );
    expect(container).toMatchSnapshot();
  });
});
