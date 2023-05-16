import { Meta } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { JSX } from 'react';

import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';
import { moreIdentitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';
import { SignDidOriginInput } from '../../channels/SignDidChannels/types';
import { paths } from '../paths';

import { SignDidStart } from './SignDidStart';

export default {
  title: 'Views/SignDidStart',
  component: SignDidStart,
} as Meta;

const input: SignDidOriginInput = {
  dAppName: 'dApp',
  origin: 'https://example.org/foo',
  plaintext:
    'All your base are belong to us All your base are belong to us All your base are belong to us',
};

const specificInput: SignDidOriginInput = {
  ...input,
  didUri: identities['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo'].did,
};

export function FullDidWithCredentials(): JSX.Element {
  return (
    <PopupTestProvider path={paths.popup.signDid.start} data={input}>
      <SignDidStart
        popupData={input}
        identity={
          identities['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo']
        }
        resetCredentials={action('resetCredentials')}
      />
    </PopupTestProvider>
  );
}

export function FullDidSpecific(): JSX.Element {
  return (
    <PopupTestProvider path={paths.popup.signDid.start} data={specificInput}>
      <SignDidStart
        popupData={specificInput}
        identity={
          identities['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo']
        }
        resetCredentials={action('resetCredentials')}
      />
    </PopupTestProvider>
  );
}

export function FullDidNoCredentials(): JSX.Element {
  return (
    <PopupTestProvider path={paths.popup.signDid.start} data={input}>
      <SignDidStart
        popupData={input}
        identity={
          identities['4q11Jce9wqM4A9GPB2z8n4K8LF9w2sQgZKFddhuKXwQ2Qo4q']
        }
        resetCredentials={action('resetCredentials')}
      />
    </PopupTestProvider>
  );
}

export function LightDid(): JSX.Element {
  return (
    <PopupTestProvider path={paths.popup.signDid.start} data={input}>
      <SignDidStart
        popupData={input}
        identity={
          identities['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1']
        }
        resetCredentials={action('resetCredentials')}
      />
    </PopupTestProvider>
  );
}
