import { Meta } from '@storybook/react';

import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';

import { AccessInput } from '../../dApps/AccessChannels/browserAccessChannels';
import { paths } from '../paths';

import { AuthorizeDApp } from './AuthorizeDApp';

export default {
  title: 'Views/AuthorizeDApp',
  component: AuthorizeDApp,
} as Meta;

const mockAccessData: AccessInput = {
  name: 'KILT-Sporran',
  origin: 'https://polkadot.js.org/apps/',
};

export function Template(): JSX.Element {
  return (
    <PopupTestProvider path={paths.popup.authorize} data={mockAccessData}>
      <AuthorizeDApp />
    </PopupTestProvider>
  );
}
