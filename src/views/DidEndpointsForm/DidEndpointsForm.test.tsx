import { MemoryRouter, Route } from 'react-router-dom';
import { IDidServiceEndpoint } from '@kiltprotocol/types';
import { DidUtils, FullDidDetails } from '@kiltprotocol/did';

import { identitiesMock, render, act } from '../../testing/testing';
import { queryFullDetailsFromIdentifier } from '../../utilities/did/did';
import { generatePath, paths } from '../paths';
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
jest.mocked(DidUtils.parseDidUrl).mockReturnValue({
  identifier: '4pehddkhEanexVTTzWAtrrfo2R7xPnePpuiJLC7shQU894aY',
} as ReturnType<typeof DidUtils.parseDidUrl>);

const detailsPromise = Promise.resolve({
  getEndpoints: () => endpoints,
} as FullDidDetails);
jest.mocked(queryFullDetailsFromIdentifier).mockReturnValue(detailsPromise);

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
