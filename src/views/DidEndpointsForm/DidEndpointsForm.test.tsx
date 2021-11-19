import { IDidServiceEndpoint } from '@kiltprotocol/types';

import { identitiesMock, render } from '../../testing/testing';

import { DidEndpointsForm } from './DidEndpointsForm';

const identity =
  identitiesMock['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'];

const endpoints: IDidServiceEndpoint[] = [
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
