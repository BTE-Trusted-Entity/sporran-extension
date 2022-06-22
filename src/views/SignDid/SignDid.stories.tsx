import { Meta } from '@storybook/react';

import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';
import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';
import { SignDidOriginInput } from '../../channels/SignDidChannels/types';
import { paths } from '../paths';

import { Presentation } from '../SignDidFlow/SignDidFlow';
import { credentialsMock } from '../../utilities/credentials/CredentialsProvider.mock';

import { SignDid } from './SignDid';

export default {
  title: 'Views/SignDid',
  component: SignDid,
} as Meta;

const input: SignDidOriginInput = {
  dAppName: 'dApp',
  origin: 'https://example.org/foo',
  plaintext:
    'AllyourbasearebelongtousAllyourbasearebelongtousAllyourbasearebelongtous',
};

export function NoCredentials(): JSX.Element {
  return (
    <PopupTestProvider path={paths.popup.sign} data={input}>
      <SignDid
        identity={
          identities['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo']
        }
      />
    </PopupTestProvider>
  );
}

const mockSingleCredential: Presentation[] = [
  {
    credential: credentialsMock[0],
    sharedContents: ['Email'],
  },
];

export function SingleCredential(): JSX.Element {
  return (
    <PopupTestProvider path={paths.popup.sign} data={input}>
      <SignDid
        identity={
          identities['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo']
        }
        credentials={mockSingleCredential}
      />
    </PopupTestProvider>
  );
}

const mockMultipleCredentials: Presentation[] = [
  {
    credential: credentialsMock[0],
    sharedContents: ['Email'],
  },
  {
    credential: credentialsMock[5],
    sharedContents: [],
  },
  {
    credential: credentialsMock[8],
    sharedContents: [],
  },
];

export function MultipleCredentials(): JSX.Element {
  return (
    <PopupTestProvider path={paths.popup.sign} data={input}>
      <SignDid
        identity={
          identities['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo']
        }
        credentials={mockMultipleCredentials}
      />
    </PopupTestProvider>
  );
}
