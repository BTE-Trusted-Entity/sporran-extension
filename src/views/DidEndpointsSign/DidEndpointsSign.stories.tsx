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
  identitiesMock['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'];

const endpoint: IDidServiceEndpoint = {
  urls: ['https://sporran.org/'],
  types: ['Some Type'],
  id: '123456',
};

const fullDidDetails = new FullDidDetails({
  did: 'did:kilt:4pehddkhEanexVTTzWAtrrfo2R7xPnePpuiJLC7shQU894aY',
  keyRelationships: {
    [KeyRelationship.authentication]: ['TODO'],
  },
  keys: [],
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
