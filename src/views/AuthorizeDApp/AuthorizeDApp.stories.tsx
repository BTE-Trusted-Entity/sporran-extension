import { Meta } from '@storybook/react';
import { JSX } from 'react';

import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';

import { AccessOriginInput } from '../../dApps/AccessChannels/types';
import { paths } from '../paths';

import { AuthorizeDApp } from './AuthorizeDApp';

export default {
  title: 'Views/AuthorizeDApp',
  component: AuthorizeDApp,
} as Meta;

const mockAccessData: AccessOriginInput = {
  dAppName: 'KILT-Sporran',
  origin: 'https://polkadot.js.org/apps/',
};

export function Template(): JSX.Element {
  return (
    <PopupTestProvider path={paths.popup.access} data={mockAccessData}>
      <AuthorizeDApp />
    </PopupTestProvider>
  );
}
