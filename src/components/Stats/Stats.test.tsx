import { render } from '../../testing';
import { Stats } from './Stats';

describe('Stats', () => {
  it('should not render for no accounts', async () => {
    const { container } = render(<Stats accounts={{}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('should not render for single account', async () => {
    const accounts = {
      '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire': {
        name: 'My Sporran Account',
        address: '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire',
        index: 1,
      },
    };
    const { container } = render(<Stats accounts={accounts} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('should render for at least two accounts', async () => {
    const accounts = {
      '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire': {
        name: 'My Sporran Account',
        address: '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire',
        index: 1,
      },
      '4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr': {
        name: 'My Second Account',
        address: '4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr',
        index: 2,
      },
      '4oyRTDhHL22Chv9T89Vv2TanfUxFzBnPeMuq4EFL3gUiHbtL': {
        name: 'My Third Account',
        address: '4oyRTDhHL22Chv9T89Vv2TanfUxFzBnPeMuq4EFL3gUiHbtL',
        index: 3,
      },
    };
    const { container } = render(<Stats accounts={accounts} />);
    expect(container).toMatchSnapshot();
  });
});
