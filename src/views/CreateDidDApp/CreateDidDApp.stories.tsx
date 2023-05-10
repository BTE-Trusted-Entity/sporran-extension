import { Meta } from '@storybook/react';
import { JSX } from 'react';

import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';
import { CreateDidOriginInput } from '../../channels/CreateDidChannels/types';

import { moreIdentitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';
import { paths } from '../paths';

import { CreateDidDApp } from './CreateDidDApp';

export default {
  title: 'Views/CreateDidDApp',
  component: CreateDidDApp,
} as Meta;

const input: CreateDidOriginInput = {
  dAppName: 'dApp',
  origin: 'https://example.org/foo',
  submitter: '4pUVoTJ69JMuapNducHJPU68nGkQXB7R9xAWY9dmvUh42653',
};

export function LightDid(): JSX.Element {
  return (
    <PopupTestProvider path={paths.popup.createDid} data={input}>
      <CreateDidDApp
        identity={
          identities['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1']
        }
      />
    </PopupTestProvider>
  );
}

export function FullDid(): JSX.Element {
  return (
    <PopupTestProvider path={paths.popup.createDid} data={input}>
      <CreateDidDApp
        identity={
          identities['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo']
        }
      />
    </PopupTestProvider>
  );
}

export function NoDid(): JSX.Element {
  return (
    <PopupTestProvider path={paths.popup.createDid} data={input}>
      <CreateDidDApp
        identity={
          identities['4rZ7pGtvmLhAYesf7DAzLQixdTEwWPN3emKb44bKVXqSoTZB']
        }
      />
    </PopupTestProvider>
  );
}
