import { Meta } from '@storybook/react';
import { IDidServiceEndpoint, KeyRelationship } from '@kiltprotocol/types';
import { FullDidDetails } from '@kiltprotocol/did';
import BN from 'bn.js';

import { identitiesMock } from '../../utilities/identities/IdentitiesProvider.mock';

import { DidEndpointsSign } from './DidEndpointsSign';

export default {
  title: 'Views/DidEndpointsSign',
  component: DidEndpointsSign,
} as Meta;

const identity =
  identitiesMock['4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr'];

const endpoint: IDidServiceEndpoint = {
  urls: ['https://sporran.org/'],
  types: ['Some Type'],
  id: `${identity.did}#123456`,
};

const key = {
  id: 'id',
  type: 'type',
  controller: identity.did,
  publicKeyHex: 'foo',
};
const fullDidDetails = new FullDidDetails({
  did: identity.did,
  keyRelationships: {
    [KeyRelationship.authentication]: [key.id],
  },
  keys: [key],
  lastTxIndex: new BN(0),
});

export function Add(): JSX.Element {
  return (
    <DidEndpointsSign
      type="add"
      identity={identity}
      endpoint={endpoint}
      fullDidDetails={fullDidDetails}
    />
  );
}

export function Remove(): JSX.Element {
  return (
    <DidEndpointsSign
      type="remove"
      identity={identity}
      endpoint={endpoint}
      fullDidDetails={fullDidDetails}
    />
  );
}
