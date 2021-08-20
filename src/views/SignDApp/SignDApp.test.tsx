import { MemoryRouter } from 'react-router-dom';

import { render } from '../../testing/testing';
import '../../components/useCopyButton/useCopyButton.mock';
import { jsonToBase64 } from '../../utilities/popups/usePopupData';
import { paths } from '../paths';

import { SignDApp } from './SignDApp';

jest.mock('@kiltprotocol/chain-helpers', () => ({}));

const mockExtrinsic = {
  origin: 'example.com',
  address: '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire',
  specVersion: 1,
  nonce: 1,
  method:
    'namespace.method(input = "some meaningful values you would definitely like to see")',
  lifetimeStart: 1,
  lifetimeEnd: 1000000,
};

const encodedData = jsonToBase64(mockExtrinsic);

describe('SignDApp', () => {
  it('should render', async () => {
    const { container } = render(
      <MemoryRouter
        initialEntries={[`${paths.popup.sign}?data=${encodedData}`]}
      >
        <SignDApp />
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });
});
