import { Meta } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';

import { paths } from '../paths';

import { SignDApp } from './SignDApp';

export default {
  title: 'Views/SignDApp',
  component: SignDApp,
} as Meta;

const query =
  'address=4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire&specVersion=1&nonce=1&method=namespace.method(input = "some meaningful values you would definitely like to see")&lifetimeStart=1&lifetimeEnd=1000000&origin=https://example.com/extremely-long-url-tries-to-overflow-all-available-space';

export function Template(): JSX.Element {
  return (
    <MemoryRouter initialEntries={[`${paths.popup.sign}?${query}`]}>
      <SignDApp />
    </MemoryRouter>
  );
}
