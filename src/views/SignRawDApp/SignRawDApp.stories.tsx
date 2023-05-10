import { Meta } from '@storybook/react';
import { JSX } from 'react';

import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';
import { SignRawOriginInput } from '../../dApps/SignRawChannels/types';
import { paths } from '../paths';

import { SignRawDApp } from './SignRawDApp';

export default {
  title: 'Views/SignRawDApp',
  component: SignRawDApp,
} as Meta;

const mockExtrinsic: SignRawOriginInput = {
  origin:
    'extremely-long-domain-name-tries-to-overflow-all-available-space-and-just-keeps-going-and-going-and-going.com',
  address: '4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1',
  id: 1,
  data: '0xCAFECAFECAFECAFECAFECAFECAFECAFECAFECAFECAFECAFECAFECAFECAFECAFECAFECAFECAFECAFECAFECAFE',
  type: 'bytes',
  dAppName: 'FOO',
};

export function Template(): JSX.Element {
  return (
    <PopupTestProvider path={paths.popup.sign} data={mockExtrinsic}>
      <SignRawDApp />
    </PopupTestProvider>
  );
}

export function Unknown(): JSX.Element {
  return (
    <PopupTestProvider
      path={paths.popup.sign}
      data={{
        ...mockExtrinsic,
        address: '4qp7KB8jbwqS6XXL8zH8qZn3GCdnZDt6Nmq5M47ztGKhXJVh',
      }}
    >
      <SignRawDApp />
    </PopupTestProvider>
  );
}
