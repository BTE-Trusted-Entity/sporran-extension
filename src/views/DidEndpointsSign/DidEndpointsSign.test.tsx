import { IDidServiceEndpoint, KeyRelationship } from '@kiltprotocol/types';
import { FullDidDetails } from '@kiltprotocol/did';
import BN from 'bn.js';

import { identitiesMock, render } from '../../testing/testing';
import { waitForGetPassword } from '../../channels/SavedPasswordsChannels/SavedPasswordsChannels.mock';

import { DidEndpointsSign } from './DidEndpointsSign';

const identity =
  identitiesMock['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'];

const endpoint: IDidServiceEndpoint = {
  urls: ['https://sporran.org/'],
  types: ['Some Type'],
  id: '123456',
};

const key = {
  id: 'id',
  type: 'type',
  controller: 'did:kilt:4pehddkhEanexVTTzWAtrrfo2R7xPnePpuiJLC7shQU894aY',
  publicKeyHex: 'foo',
};
const fullDidDetails = new FullDidDetails({
  did: key.controller,
  keyRelationships: {
    [KeyRelationship.authentication]: [key.id],
  },
  keys: [key],
  lastTxIndex: new BN(0),
});

describe('DidEndpointsSign', () => {
  it('should match the snapshot when adding', async () => {
    const { container } = render(
      <DidEndpointsSign
        type="add"
        identity={identity}
        endpoint={endpoint}
        fullDidDetails={fullDidDetails}
      />,
    );

    await waitForGetPassword();
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot when removing', async () => {
    const { container } = render(
      <DidEndpointsSign
        type="remove"
        identity={identity}
        endpoint={endpoint}
        fullDidDetails={fullDidDetails}
      />,
    );

    await waitForGetPassword();
    expect(container).toMatchSnapshot();
  });
});
