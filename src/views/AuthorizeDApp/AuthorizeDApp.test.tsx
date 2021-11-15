import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';
import { render } from '../../testing/testing';

import { AccessInput } from '../../dApps/AccessChannels/browserAccessChannels';
import { paths } from '../paths';
import { AuthorizeDApp } from './AuthorizeDApp';

const mockAccessData: AccessInput = {
  name: 'KILT-Sporran',
  origin: 'https://polkadot.js.org/apps/',
};

describe('AuthorizeDApp', () => {
  it('should render', async () => {
    const { container } = render(
      <PopupTestProvider path={paths.popup.authorize} data={mockAccessData}>
        <AuthorizeDApp />
      </PopupTestProvider>,
    );
    expect(container).toMatchSnapshot();
  });
});
