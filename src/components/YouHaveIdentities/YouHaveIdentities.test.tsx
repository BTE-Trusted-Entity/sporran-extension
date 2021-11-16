import {
  identitiesMock,
  IdentitiesProviderMock,
  render,
} from '../../testing/testing';

import { YouHaveIdentities } from './YouHaveIdentities';

describe('YouHaveIdentities', () => {
  it('should match the snapshot for one identity', async () => {
    const { container } = render(
      <IdentitiesProviderMock
        identities={{
          '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire':
            identitiesMock['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'],
        }}
      >
        <YouHaveIdentities />
      </IdentitiesProviderMock>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot for multiple identities', async () => {
    const { container } = render(<YouHaveIdentities />);
    expect(container).toMatchSnapshot();
  });
});
