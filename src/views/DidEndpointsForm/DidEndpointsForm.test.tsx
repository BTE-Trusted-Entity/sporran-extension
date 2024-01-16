import type { DidDocument, Service } from '@kiltprotocol/types';

import { ConfigService, connect } from '@kiltprotocol/sdk-js';

import { MemoryRouter, Route } from 'react-router-dom';

import { identitiesMock, render, screen } from '../../testing/testing';
import { useFullDidDocument } from '../../utilities/did/did';
import { generatePath, paths } from '../paths';
import '../../components/useCopyButton/useCopyButton.mock';

import { DidEndpointsForm } from './DidEndpointsForm';

const identity =
  identitiesMock['4pNXuxPWhMxhRctgB4qd3MkRt2Sxp7Y7sxrApVCVXCEcdQMo'];

const service: Service[] = [
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
} as unknown as Awaited<ReturnType<typeof connect>>;
ConfigService.set({ api });

describe('DidEndpointsForm', () => {
  it('should match the snapshot', async () => {
    jest.mocked(useFullDidDocument).mockReturnValue({ service } as DidDocument);

    const mock = jest.spyOn(Math, 'random').mockReturnValue(0.123456);
    const { container } = render(
      <MemoryRouter
        initialEntries={[
          generatePath(paths.identity.did.manage.endpoints.start, {
            address: 'FOO',
          }),
        ]}
      >
        <Route path={paths.identity.did.manage.endpoints.edit}>
          <DidEndpointsForm
            identity={identity}
            onAdd={jest.fn()}
            onRemove={jest.fn()}
          />
        </Route>
      </MemoryRouter>,
    );

    expect(container).toMatchSnapshot();
    mock.mockClear();
  });

  it('should match the snapshot when no service endpoints', async () => {
    jest.mocked(useFullDidDocument).mockReturnValue({} as DidDocument);

    const mock = jest.spyOn(Math, 'random').mockReturnValue(0.123456);
    const { container } = render(
      <MemoryRouter
        initialEntries={[
          generatePath(paths.identity.did.manage.endpoints.start, {
            address: 'FOO',
          }),
        ]}
      >
        <Route path={paths.identity.did.manage.endpoints.edit}>
          <DidEndpointsForm
            identity={identity}
            onAdd={jest.fn()}
            onRemove={jest.fn()}
          />
        </Route>
      </MemoryRouter>,
    );

    await screen.getByLabelText('URL');

    expect(container).toMatchSnapshot();
    mock.mockClear();
  });
});
