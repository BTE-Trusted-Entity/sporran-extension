import { MemoryRouter, Route } from 'react-router-dom';
import { DidServiceEndpoint } from '@kiltprotocol/types';
import { DidUtils, FullDidDetails } from '@kiltprotocol/did';

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
    id: `${identity.did}#123456`,
  },
  {
    urls: ['https://kilt.io/'],
    types: ['Another Type'],
    id: `${identity.did}#654321`,
  },
];

jest.mocked(DidUtils.parseDidUri).mockReturnValue({
  identifier: '4pehddkhEanexVTTzWAtrrfo2R7xPnePpuiJLC7shQU894aY',
} as ReturnType<typeof DidUtils.parseDidUri>);

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
