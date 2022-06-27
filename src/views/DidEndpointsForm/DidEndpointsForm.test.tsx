import { MemoryRouter, Route } from 'react-router-dom';
import { DidServiceEndpoint } from '@kiltprotocol/types';
import { Utils, FullDidDetails } from '@kiltprotocol/did';
import {
  Blockchain,
  BlockchainApiConnection,
} from '@kiltprotocol/chain-helpers';
import { Codec } from '@polkadot/types/types';

import { identitiesMock, render, act } from '../../testing/testing';
import { getFullDidDetails } from '../../utilities/did/did';
import { generatePath, paths } from '../paths';
import '../../components/useCopyButton/useCopyButton.mock';

import { DidEndpointsForm } from './DidEndpointsForm';

const identity =
  identitiesMock['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo'];

const endpoints: DidServiceEndpoint[] = [
  {
    urls: ['https://sporran.org/'],
    types: ['Some Type'],
    id: '123456',
  },
  {
    urls: ['https://kilt.io/'],
    types: ['Another Type'],
    id: '654321',
  },
];

jest.mocked(BlockchainApiConnection.getConnectionOrConnect).mockResolvedValue({
  api: {
    consts: {
      did: {
        maxServiceIdLength: { toNumber: () => 50 } as unknown as Codec,
        maxServiceTypeLength: { toNumber: () => 50 } as unknown as Codec,
        maxServiceUrlLength: { toNumber: () => 200 } as unknown as Codec,
        maxNumberOfServicesPerDid: { toNumber: () => 25 } as unknown as Codec,
      },
    },
  },
} as unknown as Blockchain);

jest.mocked(Utils.parseDidUri).mockReturnValue({
  identifier: '4pehddkhEanexVTTzWAtrrfo2R7xPnePpuiJLC7shQU894aY',
} as ReturnType<typeof Utils.parseDidUri>);

const detailsPromise = Promise.resolve({
  getEndpoints: () => endpoints,
} as FullDidDetails);
jest.mock('../../utilities/did/did');
jest.mocked(getFullDidDetails).mockReturnValue(detailsPromise);

describe('DidEndpointsForm', () => {
  it('should match the snapshot', async () => {
    const { container } = render(
      <MemoryRouter
        initialEntries={[
          generatePath(paths.identity.did.manage.endpoints.start, {
            address: 'FOO',
          }),
        ]}
      >
        <Route path={paths.identity.did.manage.endpoints.start}>
          <DidEndpointsForm
            identity={identity}
            onAdd={jest.fn()}
            onRemove={jest.fn()}
          />
        </Route>
      </MemoryRouter>,
    );

    await act(async () => {
      await detailsPromise;
    });
    expect(container).toMatchSnapshot();
  });
});
