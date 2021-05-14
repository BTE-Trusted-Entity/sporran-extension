import { MemoryRouter } from 'react-router-dom';

import { render } from '../../testing/testing';
import { paths } from '../paths';

import { AuthorizeDApp } from './AuthorizeDApp';

const query =
  'name=KILT-Sporran&origin=https%3A%2F%2Fpolkadot.js.org%2Fapps%2F';

describe('AuthorizeDApp', () => {
  it('should render', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={[`${paths.popup.authorize}?${query}`]}>
        <AuthorizeDApp />
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });
});
