import { render } from '../../testing/testing';
import { paths, generatePath } from '../paths';
import { identitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';

import { ExistentialWarning } from './ExistentialWarning';

const identity = identities['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'];

const reviewPath = generatePath(paths.identity.send.review, {
  address: identity.address,
});

describe('ExistentialWarning', () => {
  it('should render with link to review screen', () => {
    const { container } = render(<ExistentialWarning path={reviewPath} />);
    expect(container).toMatchSnapshot();
  });
});
