import { IDidServiceEndpoint } from '@kiltprotocol/types';

import { identitiesMock, render } from '../../testing/testing';

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

describe('DidEndpointsForm', () => {
  it('should match the snapshot', async () => {
    const { container } = render(
      <DidEndpointsForm
        identity={identity}
        endpoints={endpoints}
        onAdd={jest.fn()}
        onRemove={jest.fn()}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
