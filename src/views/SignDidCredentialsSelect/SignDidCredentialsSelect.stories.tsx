import { Meta } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';
import { mockRequestCredential } from '../../utilities/credentials/CredentialsProvider.mock';
import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';

import { paths } from '../paths';

import { SignDidCredentialsSelect } from './SignDidCredentialsSelect';

export default {
  title: 'Views/SignDidCredentialsSelect',
  component: SignDidCredentialsSelect,
} as Meta;

export function Template() {
  return (
    <PopupTestProvider
      path={paths.popup.share.start}
      data={mockRequestCredential}
    >
      <SignDidCredentialsSelect
        identity={
          identities['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo']
        }
        onCancel={action('onCancel')}
        onSubmit={action('onSubmit')}
      />
    </PopupTestProvider>
  );
}
