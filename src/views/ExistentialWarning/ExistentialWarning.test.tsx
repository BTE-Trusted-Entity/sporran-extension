import { identitiesMock as identities, render } from '../../testing/testing';
import { paths, generatePath } from '../paths';

import { ExistentialWarning } from './ExistentialWarning';

const identity = identities['4tDjyLy2gESkLzvaLnpbn7N61VgnwAhqnTHsPPFAwaZjGwP1'];

const reviewPath = generatePath(paths.identity.send.review, {
  address: identity.address,
});

describe('ExistentialWarning', () => {
  it('should render with link to sign transfer screen', async () => {
    const { container } = render(<ExistentialWarning nextPath={reviewPath} />);

    expect(container).toMatchSnapshot();
  });
});
