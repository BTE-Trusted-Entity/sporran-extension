import { Meta } from '@storybook/react';
import { JSX } from 'react';

import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';
import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';
import { SignDidExtrinsicOriginInput } from '../../channels/SignDidExtrinsicChannels/types';
import { paths } from '../paths';

import { SignDidExtrinsic } from './SignDidExtrinsic';

export default {
  title: 'Views/SignDidExtrinsic',
  component: SignDidExtrinsic,
} as Meta;

const dApp: Omit<SignDidExtrinsicOriginInput, 'extrinsic'> = {
  dAppName: 'dApp',
  origin: 'https://example.org/foo',
  submitter: '4safqRNsTyQnjBh2yq9Yeo2MC8BnDpDomgsd8PWimTcP5FSh',
};

const input: Record<string, SignDidExtrinsicOriginInput> = {
  addEndpoint: {
    ...dApp,
    extrinsic:
      '0x900440081837303634333904146473616664044468747470733a2f2f73646664732e636f6d',
  },
  removeEndpoint: {
    ...dApp,
    extrinsic: '0x2804400918343935373831',
  },
  web3name: {
    ...dApp,
    extrinsic: '0x3404440024746573742d6e616d65',
  },
  forbidden: {
    ...dApp,
    extrinsic:
      '0x9004400600def12e42f3e487e9b14095aa8d5cc16a33491f1b50dadcf8811d1480f3fa8627',
  },
  publicCredential: {
    ...dApp,
    extrinsic:
      '0x29020445003291bb126e33b4862d421bfaa1d2f272e6cdfc4f96658988fbcffea8914bd9ac1d016469643a61737365743a6569703135353a312e6572633732313a3078303835633039316237316239643737623866353266303733643733386365383035646563333639623a323770a165456d61696c746c756b656772756e617540676d61696c2e636f6d00',
  },
};

export function AddEndpoint(): JSX.Element {
  return (
    <PopupTestProvider
      path={paths.popup.signDidExtrinsic}
      data={input.addEndpoint}
    >
      <SignDidExtrinsic
        identity={
          identities['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo']
        }
      />
    </PopupTestProvider>
  );
}

export function RemoveEndpoint(): JSX.Element {
  return (
    <PopupTestProvider
      path={paths.popup.signDidExtrinsic}
      data={input.removeEndpoint}
    >
      <SignDidExtrinsic
        identity={
          identities['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo']
        }
      />
    </PopupTestProvider>
  );
}

export function web3Name(): JSX.Element {
  return (
    <PopupTestProvider
      path={paths.popup.signDidExtrinsic}
      data={input.web3name}
    >
      <SignDidExtrinsic
        identity={
          identities['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo']
        }
      />
    </PopupTestProvider>
  );
}

export function Forbidden(): JSX.Element {
  return (
    <PopupTestProvider
      path={paths.popup.signDidExtrinsic}
      data={input.forbidden}
    >
      <SignDidExtrinsic
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
      <SignDidExtrinsic
        identity={
          identities['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1']
        }
      />
    </PopupTestProvider>
  );
}

export function PublicCredential(): JSX.Element {
  return (
    <PopupTestProvider
      path={paths.popup.signDidExtrinsic}
      data={input.publicCredential}
    >
      <SignDidExtrinsic
        identity={
          identities['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo']
        }
      />
    </PopupTestProvider>
  );
}
