import { MemoryRouter } from 'react-router-dom';

import { render } from '../../testing/testing';
import { paths } from '../paths';

import { SignDApp } from './SignDApp';

const query = 'address=4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire';

describe('SignDApp', () => {
  it('should render', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={[`${paths.popup.sign}?${query}`]}>
        <SignDApp />
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });
});
