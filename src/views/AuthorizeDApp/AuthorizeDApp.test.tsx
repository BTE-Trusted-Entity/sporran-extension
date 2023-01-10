import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';
import { render } from '../../testing/testing';

import { AccessOriginInput } from '../../channels/AccessChannels/types';
import { paths } from '../paths';

import { AuthorizeDApp } from './AuthorizeDApp';

const mockAccessData: AccessOriginInput = {
  dAppName: 'KILT-Sporran',
  origin: 'https://polkadot.js.org/apps/',
};

describe('AuthorizeDApp', () => {
  it('should render', async () => {
    const { container } = render(
      <PopupTestProvider path={paths.popup.access} data={mockAccessData}>
        <AuthorizeDApp />
      </PopupTestProvider>,
    );
    expect(container).toMatchSnapshot();
  });
});
