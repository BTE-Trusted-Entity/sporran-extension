import { IDidServiceEndpoint } from '@kiltprotocol/types';
import { DidUtils } from '@kiltprotocol/did';

import { identitiesMock, render } from '../../testing/testing';
import { waitForGetPassword } from '../../channels/SavedPasswordsChannels/SavedPasswordsChannels.mock';
import { queryFullDetailsFromIdentifier } from '../../utilities/did/did';

import { DidEndpointsSign } from './DidEndpointsSign';

const identity =
  identitiesMock['4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr'];

const endpoint: IDidServiceEndpoint = {
  urls: ['https://sporran.org/'],
  types: ['Some Type'],
  id: `${identity.did}#123456`,
};

jest.mock('@kiltprotocol/did', () => ({
  DidUtils: { parseDidUrl: jest.fn() },
}));
(DidUtils.parseDidUrl as jest.Mock).mockReturnValue({
  identifier: '4pehddkhEanexVTTzWAtrrfo2R7xPnePpuiJLC7shQU894aY',
});

const detailsPromise = Promise.resolve({});
(queryFullDetailsFromIdentifier as jest.Mock).mockReturnValue(detailsPromise);

describe('DidEndpointsSign', () => {
  it('should match the snapshot when adding', async () => {
    const { container } = render(
      <DidEndpointsSign type="add" identity={identity} endpoint={endpoint} />,
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
      />,
    );

    await waitForGetPassword();
    expect(container).toMatchSnapshot();
  });
});
