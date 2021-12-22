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

import { ShareCredentialSelect } from './ShareCredentialSelect';
import { Selected } from '../ShareCredential/ShareCredential';

export default {
  title: 'Views/ShareCredentialSelect',
  component: ShareCredentialSelect,
} as Meta;

const mockSelected: Selected = {
  credential: credentialsMock[4],
  identity: identitiesMock['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'],
  sharedProps: ['Email'],
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
