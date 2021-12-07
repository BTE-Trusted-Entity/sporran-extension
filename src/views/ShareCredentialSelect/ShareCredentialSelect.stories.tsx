import { Meta } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { credentialsMock } from '../../utilities/credentials/CredentialsProvider.mock';
import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';

import { ShareInput } from '../../channels/shareChannel/types';

import { paths } from '../paths';

import { ShareCredentialSelect } from './ShareCredentialSelect';
import { Selected } from '../ShareCredential/ShareCredential';
import { identitiesMock } from '../../utilities/identities/IdentitiesProvider.mock';

export default {
  title: 'Views/ShareCredentialSelect',
  component: ShareCredentialSelect,
} as Meta;

const mockShareInput: ShareInput = {
  credentialRequest: {
    cTypes: [
      {
        cTypeHash: credentialsMock[0].request.claim.cTypeHash,
        requiredProperties: ['Email'],
      },
    ],
    challenge: 'PASS',
  },
  verifierDid: 'did:kilt:4pehddkhEanexVTTzWAtrrfo2R7xPnePpuiJLC7shQU894aY',
};

const mockSelected: Selected = {
  credential: credentialsMock[4],
  identity: identitiesMock['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'],
  sharedProps: ['Email'],
};

export function Template(): JSX.Element {
  return (
    <PopupTestProvider path={paths.popup.share} data={mockShareInput}>
      <ShareCredentialSelect
        selected={mockSelected}
        onCancel={action('onCancel')}
        onSelect={action('onSelect')}
      />
    </PopupTestProvider>
  );
}
