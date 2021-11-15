import { Meta } from '@storybook/react';

import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';
import { credentialsMock } from '../../utilities/credentials/CredentialsProvider.mock';
import { ShareInput } from '../../channels/shareChannel/types';
import { paths } from '../paths';

import { ShareCredential } from './ShareCredential';

export default {
  title: 'Views/ShareCredential',
  component: ShareCredential,
} as Meta;

const mockCTypesRequest: ShareInput = {
  credentialRequest: {
    cTypes: [
      {
        cTypeHash: credentialsMock[0].request.claim.cTypeHash,
      },
    ],
    challenge: 'PASS',
  },
  verifierDid: 'did:kilt:4pehddkhEanexVTTzWAtrrfo2R7xPnePpuiJLC7shQU894aY',
};

export function Template(): JSX.Element {
  return (
    <PopupTestProvider path={paths.popup.share} data={mockCTypesRequest}>
      <ShareCredential />
    </PopupTestProvider>
  );
}
