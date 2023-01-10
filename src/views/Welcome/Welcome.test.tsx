import { identitiesMock, render } from '../../testing/testing';
import {
  useCurrentIdentity,
  useIdentities,
} from '../../utilities/identities/identities';

import { Welcome } from './Welcome';

jest.mock('../../utilities/identities/identities');
jest
  .mocked(useCurrentIdentity)
  .mockReturnValue('4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1');

describe('Welcome', () => {
  it('should match the snapshot without identities', () => {
    jest.mocked(useIdentities).mockReturnValue({ data: {} });
    const { container } = render(<Welcome />);
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot with an identity', () => {
    jest.mocked(useIdentities).mockReturnValue({ data: identitiesMock });
    const { container } = render(<Welcome again />);
    expect(container).toMatchSnapshot();
  });
});
