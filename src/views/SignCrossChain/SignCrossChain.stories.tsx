import { Meta } from '@storybook/react';
import { JSX } from 'react';

import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';
import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';
import { SignDidExtrinsicOriginInput } from '../../channels/SignDidExtrinsicChannels/types';
import { paths } from '../paths';

import { SignCrossChain } from './SignCrossChain';

export default {
  title: 'Views/SignCrossChain',
  component: SignCrossChain,
} as Meta;

const dApp: Omit<SignDidExtrinsicOriginInput, 'extrinsic'> = {
  dAppName: 'dApp',
  origin: 'https://example.org/foo',
  submitter: '4safqRNsTyQnjBh2yq9Yeo2MC8BnDpDomgsd8PWimTcP5FSh',
};

const input: Record<string, SignDidExtrinsicOriginInput> = {
  web3name: {
    ...dApp,
    extrinsic: '0x3404440024746573742d6e616d65',
  },
  forbidden: {
    ...dApp,
    extrinsic:
      '0x9004400600def12e42f3e487e9b14095aa8d5cc16a33491f1b50dadcf8811d1480f3fa8627',
  },
};

export function web3Name(): JSX.Element {
  return (
    <PopupTestProvider
      path={paths.popup.signDidExtrinsic}
      data={input.web3name}
    >
      <SignCrossChain
        identity={
          identities['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo']
        }
      />
    </PopupTestProvider>
  );
}

export function LightDid(): JSX.Element {
  return (
    <PopupTestProvider
      path={paths.popup.signDidExtrinsic}
      data={input.addEndpoint}
    >
      <SignCrossChain
        identity={
          identities['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1']
        }
      />
    </PopupTestProvider>
  );
}
