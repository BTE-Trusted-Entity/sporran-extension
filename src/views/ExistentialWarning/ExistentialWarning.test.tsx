import { render } from '../../testing/testing';
import { paths, generatePath } from '../paths';
import { accountsMock as accounts } from '../../utilities/accounts/AccountsProvider.mock';

import { ExistentialWarning } from './ExistentialWarning';

const account = accounts['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'];

const reviewPath = generatePath(paths.account.send.review, {
  address: account.address,
});

describe('ExistentialWarning', () => {
  it('should render with link to review screen', () => {
    const { container } = render(<ExistentialWarning path={reviewPath} />);
    expect(container).toMatchSnapshot();
  });
});
