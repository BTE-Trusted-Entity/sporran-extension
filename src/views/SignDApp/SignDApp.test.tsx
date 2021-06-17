import { MemoryRouter } from 'react-router-dom';

import { render } from '../../testing/testing';
import '../../components/useCopyButton/useCopyButton.mock';
import { paths } from '../paths';

import { SignDApp } from './SignDApp';

const query =
  'address=4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire&specVersion=1&nonce=1&method=namespace.method(input = "some meaningful values you would definitely like to see")&lifetimeStart=1&lifetimeEnd=1000000&origin=https://example.com/extremely-long-url-tries-to-overflow-all-available-space';

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
