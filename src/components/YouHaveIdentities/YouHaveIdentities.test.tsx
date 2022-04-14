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
          '4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1':
            identitiesMock['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1'],
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
