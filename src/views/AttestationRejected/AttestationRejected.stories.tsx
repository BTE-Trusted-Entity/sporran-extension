import { Meta } from '@storybook/react';

import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';
import { credentialsMock } from '../../utilities/credentials/CredentialsProvider.mock';
import { paths } from '../paths';

import { AttestationRejected } from './AttestationRejected';

export default {
  title: 'Views/AttestationRejected',
  component: AttestationRejected,
} as Meta;

export function Template(): JSX.Element {
  return (
    <PopupTestProvider
      path={paths.popup.reject}
      data={credentialsMock[13].credential.rootHash}
    >
      <AttestationRejected />
    </PopupTestProvider>
  );
}
