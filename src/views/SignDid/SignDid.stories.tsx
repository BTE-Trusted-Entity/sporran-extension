import { Meta } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';
import { SignDidOriginInput } from '../../channels/SignDidChannels/types';

import { credentialsMock } from '../../utilities/credentials/CredentialsProvider.mock';

import { SharedCredential } from '../../utilities/credentials/credentials';

import { SignDid } from './SignDid';

export default {
  title: 'Views/SignDid',
  component: SignDid,
} as Meta;

const mockPopupData: SignDidOriginInput = {
  dAppName: 'dApp',
  origin: 'https://example.org/foo',
  plaintext:
    'AllyourbasearebelongtousAllyourbasearebelongtousAllyourbasearebelongtous',
};

export function NoCredentials() {
  return (
    <SignDid
      identity={identities['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo']}
      popupData={mockPopupData}
      onCancel={action('onCancel')}
    />
  );
}

const mockSingleCredential: SharedCredential[] = [
  {
    sporranCredential: credentialsMock[0],
    sharedContents: ['Email'],
  },
];

export function SingleCredential() {
  return (
    <SignDid
      identity={identities['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo']}
      popupData={mockPopupData}
      onCancel={action('onCancel')}
      credentials={mockSingleCredential}
    />
  );
}

const mockMultipleCredentials: SharedCredential[] = [
  {
    sporranCredential: credentialsMock[0],
    sharedContents: ['Email'],
  },
  {
    sporranCredential: credentialsMock[5],
    sharedContents: [],
  },
  {
    sporranCredential: credentialsMock[8],
    sharedContents: [],
  },
];

export function MultipleCredentials() {
  return (
    <SignDid
      identity={identities['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo']}
      popupData={mockPopupData}
      onCancel={action('onCancel')}
      credentials={mockMultipleCredentials}
    />
  );
}
