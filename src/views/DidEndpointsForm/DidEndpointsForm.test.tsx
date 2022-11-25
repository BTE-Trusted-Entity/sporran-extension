import { MemoryRouter, Route } from 'react-router-dom';
import { DidDocument, DidServiceEndpoint } from '@kiltprotocol/types';
import { ConfigService } from '@kiltprotocol/config';
import { connect } from '@kiltprotocol/core';

import { identitiesMock, render, act } from '../../testing/testing';
import { getFullDidDocument } from '../../utilities/did/did';
import { generatePath, paths } from '../paths';
import '../../components/useCopyButton/useCopyButton.mock';

import { DidEndpointsForm } from './DidEndpointsForm';

const identity =
  identitiesMock['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo'];

const service: DidServiceEndpoint[] = [
  {
    serviceEndpoint: ['https://sporran.org/'],
    type: ['Some Type'],
    id: '#123456',
  },
  {
    serviceEndpoint: ['https://kilt.io/'],
    type: ['Another Type'],
    id: '#654321',
  },
];

const api = {
  consts: {
    did: {
      maxServiceIdLength: { toNumber: () => 50 },
      maxServiceTypeLength: { toNumber: () => 50 },
      maxServiceUrlLength: { toNumber: () => 200 },
      maxNumberOfServicesPerDid: { toNumber: () => 25 },
    },
  },
} as Awaited<ReturnType<typeof connect>>;
ConfigService.set({ api });

const documentPromise = Promise.resolve({ service } as DidDocument);
jest.mock('../../utilities/did/did');
jest.mocked(getFullDidDocument).mockReturnValue(documentPromise);

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
      await documentPromise;
    });
    expect(container).toMatchSnapshot();
  });
});
