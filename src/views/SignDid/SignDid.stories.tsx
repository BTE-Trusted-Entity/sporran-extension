import { Meta } from '@storybook/react';

import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';
import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';
import { SignDidOriginInput } from '../../channels/SignDidChannels/types';
import { paths } from '../paths';

import { SignDid } from './SignDid';

export default {
  title: 'Views/SignDid',
  component: SignDid,
} as Meta;

const input: SignDidOriginInput = {
  dAppName: 'dApp',
  origin: 'https://example.org/foo',
  plaintext:
    'All your base are belong to us All your base are belong to us All your base are belong to us',
};

export function Template(): JSX.Element {
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
