import { Meta } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { identitiesMock } from '../../utilities/identities/IdentitiesProvider.mock';
import {
  credentialsMock,
  mockRequestCredential,
  mockUnknownCType,
} from '../../utilities/credentials/CredentialsProvider.mock';
import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';

import { paths } from '../paths';
import { Selected } from '../ShareCredential/ShareCredential';

import { ShareCredentialSelect } from './ShareCredentialSelect';

export default {
  title: 'Views/ShareCredentialSelect',
  component: ShareCredentialSelect,
} as Meta;

const mockSelected: Selected = {
  sporranCredential: credentialsMock[4],
  identity: identitiesMock['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1'],
  sharedContents: ['Email'],
};

const mockRevokedSelected: Selected = {
  ...mockSelected,
  sporranCredential: credentialsMock[2],
};

export function Template(): JSX.Element {
  return (
    <PopupTestProvider
      path={paths.popup.share.start}
      data={mockRequestCredential}
    >
      <ShareCredentialSelect
        selected={mockSelected}
        onCancel={action('onCancel')}
        onSelect={action('onSelect')}
      />
    </PopupTestProvider>
  );
}

export function RevokedSelected(): JSX.Element {
  return (
    <PopupTestProvider
      path={paths.popup.share.start}
      data={mockRequestCredential}
    >
      <ShareCredentialSelect
        selected={mockRevokedSelected}
        onCancel={action('onCancel')}
        onSelect={action('onSelect')}
      />
    </PopupTestProvider>
  );
}

export function NoMatchingCredentials(): JSX.Element {
  return (
    <PopupTestProvider path={paths.popup.share.start} data={mockUnknownCType}>
      <ShareCredentialSelect
        selected={mockSelected}
        onCancel={action('onCancel')}
        onSelect={action('onSelect')}
      />
    </PopupTestProvider>
  );
}
