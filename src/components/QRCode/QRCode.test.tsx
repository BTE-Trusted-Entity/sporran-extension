import { QRCode } from './QRCode';
import { render } from '../../testing';

describe('QRCode', () => {
  it('should render', async () => {
    const { container } = render(
      <QRCode address="4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire" />,
    );
    expect(container).toMatchSnapshot();
  });
});
