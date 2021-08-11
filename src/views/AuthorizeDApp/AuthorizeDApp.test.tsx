import { MemoryRouter } from 'react-router-dom';

import { jsonToBase64 } from '../../utilities/popups/usePopupData';
import { render } from '../../testing/testing';

import { paths } from '../paths';
import { AuthorizeDApp } from './AuthorizeDApp';

const mockAccessData = {
  name: 'KILT-Sporran',
  origin: 'https://polkadot.js.org/apps/',
};

const encodedData = jsonToBase64(mockAccessData);

describe('AuthorizeDApp', () => {
  it('should render', async () => {
    const { container } = render(
      <MemoryRouter
        initialEntries={[`${paths.popup.authorize}?data=${encodedData}`]}
      >
        <AuthorizeDApp />
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });
});
