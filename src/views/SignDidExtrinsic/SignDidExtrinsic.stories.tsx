import { Meta } from '@storybook/react';

import { PopupTestProvider } from '../../utilities/popups/PopupTestProvider';
import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';
import { SignDidExtrinsicOriginInput } from '../../channels/SignDidExtrinsicChannels/types';
import { paths } from '../paths';

import { SignDidExtrinsic } from './SignDidExtrinsic';

export default {
  title: 'Views/SignDidExtrinsic',
  component: SignDidExtrinsic,
} as Meta;

const dApp = {
  dAppName: 'dApp',
  origin: 'https://example.org/foo',
  signer: '4safqRNsTyQnjBh2yq9Yeo2MC8BnDpDomgsd8PWimTcP5FSh',
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
  linking: {
    ...dApp,
    signingDid: 'did:kilt:4oeJ76hdj84xnwCNqijUHUCTmfwXgSZ4vmxLEiTEYgQdBCcZ',
    extrinsic:
      '0xb10104430094179b81685950cdaef21f10d93db6dcc8678141689130802a4a6f6d66938b65585a17000000000001f0ace78afd92a26280a5c512f8d32e00bf485bf50a63d86dbb2eeb5cf3b5f229565619a097c9ec71f8f6980e8363e85df2e46708e175a7ae1d4437fef8674089',
  },
  forbidden: {
    ...dApp,
    extrinsic:
      '0x9004400600def12e42f3e487e9b14095aa8d5cc16a33491f1b50dadcf8811d1480f3fa8627',
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

export function Linking(): JSX.Element {
  return (
    <PopupTestProvider path={paths.popup.signDidExtrinsic} data={input.linking}>
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
