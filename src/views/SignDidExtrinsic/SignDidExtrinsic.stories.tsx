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
  removeEndpointSpecific: {
    ...dApp,
    extrinsic: '0x2804400918343935373831',
    didUri: identities['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo'].did,
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
};

export function AddEndpoint() {
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

export function RemoveEndpoint() {
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

export function RemoveEndpointSpecific() {
  return (
    <PopupTestProvider
      path={paths.popup.signDidExtrinsic}
      data={input.removeEndpointSpecific}
    >
      <SignDidExtrinsic
        identity={
          identities['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo']
        }
      />
    </PopupTestProvider>
  );
}

export function web3Name() {
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

export function Forbidden() {
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

export function LightDid() {
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
