import { IDidServiceEndpoint } from '@kiltprotocol/types';
import { DidUtils } from '@kiltprotocol/did';

import { identitiesMock, render, act } from '../../testing/testing';
import { queryFullDetailsFromIdentifier } from '../../utilities/did/did';
import '../../components/useCopyButton/useCopyButton.mock';

import { DidEndpointsForm } from './DidEndpointsForm';

const identity =
  identitiesMock['4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr'];

const endpoints: IDidServiceEndpoint[] = [
  {
    urls: ['https://sporran.org/'],
    types: ['Some Type'],
    id: `${identity.did}#123456`,
  },
  {
    urls: ['https://kilt.io/'],
    types: ['Another Type'],
    id: `${identity.did}#654321`,
  },
];

jest.mock('@kiltprotocol/did', () => ({
  DidUtils: { parseDidUrl: jest.fn() },
}));
(DidUtils.parseDidUrl as jest.Mock).mockReturnValue({
  identifier: '4pehddkhEanexVTTzWAtrrfo2R7xPnePpuiJLC7shQU894aY',
});

const detailsPromise = Promise.resolve({ getEndpoints: () => endpoints });
(queryFullDetailsFromIdentifier as jest.Mock).mockReturnValue(detailsPromise);

describe('DidEndpointsForm', () => {
  it('should match the snapshot', async () => {
    const { container } = render(
      <DidEndpointsForm
        identity={identity}
        onAdd={jest.fn()}
        onRemove={jest.fn()}
      />,
    );

    await act(async () => {
      await detailsPromise;
    });
    expect(container).toMatchSnapshot();
  });
});
