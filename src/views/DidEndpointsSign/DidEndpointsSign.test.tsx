import { IDidServiceEndpoint, KeyRelationship } from '@kiltprotocol/types';
import { FullDidDetails } from '@kiltprotocol/did';
import BN from 'bn.js';

import { identitiesMock, render } from '../../testing/testing';
import { waitForGetPassword } from '../../channels/SavedPasswordsChannels/SavedPasswordsChannels.mock';

import { DidEndpointsSign } from './DidEndpointsSign';

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
