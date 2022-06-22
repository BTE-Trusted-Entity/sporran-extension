import { Meta } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';
import {
  credentialsMock,
  mockRequestCredential,
} from '../../utilities/credentials/CredentialsProvider.mock';
import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';

import { paths } from '../paths';

import { Selected } from '../SignDidFlow/SignDidFlow';

import { SignDidCredentialsSelect } from './SignDidCredentialsSelect';

export default {
  title: 'Views/SignDidCredentialsSelect',
  component: SignDidCredentialsSelect,
} as Meta;

const mockSelected: Selected = {
  credential: credentialsMock[4],
  sharedContents: ['Email'],
};

export function Template(): JSX.Element {
  return (
    <PopupTestProvider
      path={paths.popup.share.start}
      data={mockRequestCredential}
    >
      <SignDidCredentialsSelect
        identity={
          identities['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo']
        }
        selected={mockSelected}
        onCancel={action('onCancel')}
        onSelect={action('onSelect')}
        onUnSelect={action('onUnSelect')}
      />
    </PopupTestProvider>
  );
}
