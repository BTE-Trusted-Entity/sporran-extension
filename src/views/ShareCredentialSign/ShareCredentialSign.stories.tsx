import { Meta } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { JSX } from 'react';

import { identitiesMock } from '../../utilities/identities/IdentitiesProvider.mock';
import { credentialsMock } from '../../utilities/credentials/CredentialsProvider.mock';

import { ShareInput } from '../../channels/shareChannel/types';

import { Selected } from '../ShareCredential/ShareCredential';

import { ShareCredentialSign } from './ShareCredentialSign';

export default {
  title: 'Views/ShareCredentialSign',
  component: ShareCredentialSign,
} as Meta;

const mockShareInput: ShareInput = {
  credentialRequest: {
    cTypes: [
      {
        cTypeHash: credentialsMock[0].credential.claim.cTypeHash,
        requiredProperties: ['Email'],
      },
    ],
    challenge: 'PASS',
  },
  verifierDid: 'did:kilt:4oeJ76hdj84xnwCNqijUHUCTmfwXgSZ4vmxLEiTEYgQdBCcZ',
  specVersion: '3.0',
};

const mockSelected: Selected = {
  sporranCredential: credentialsMock[4],
  identity: identitiesMock['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1'],
  sharedContents: ['Email'],
};

export function Template(): JSX.Element {
  return (
    <ShareCredentialSign
      selected={mockSelected}
      onCancel={action('onCancel')}
      popupData={mockShareInput}
    />
  );
}
