import { render } from '../../testing/testing';
import { QRCode } from './QRCode';

describe('QRCode', () => {
  it('should render', async () => {
    const { container } = render(
      <QRCode address="4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire" />,
    );
    expect(container).toMatchSnapshot();
  });
});
