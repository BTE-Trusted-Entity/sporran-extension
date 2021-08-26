import { Meta } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';

import { jsonToBase64 } from '../../utilities/popups/usePopupData';
import { paths } from '../paths';

import { SignDApp } from './SignDApp';

export default {
  title: 'Views/SignDApp',
  component: SignDApp,
} as Meta;

const mockExtrinsic = {
  origin:
    'extremely-long-domain-name-tries-to-overflow-all-available-space-and-just-keeps-going-and-going-and-going.com',
  address: '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire',
  specVersion: 1,
  nonce: 1,
  method:
    'namespace.method(input = "some meaningful values you would definitely like to see")',
  lifetimeStart: 1,
  lifetimeEnd: 1000000,
};

const encodedData = jsonToBase64(mockExtrinsic);

export function Template(): JSX.Element {
  return (
    <MemoryRouter initialEntries={[`${paths.popup.sign}?data=${encodedData}`]}>
      <SignDApp />
    </MemoryRouter>
  );
}
