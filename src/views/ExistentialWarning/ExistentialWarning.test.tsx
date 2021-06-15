import { render, screen } from '../../testing/testing';
import { paths, generatePath } from '../paths';
import { accountsMock as accounts } from '../../utilities/accounts/AccountsProvider.mock';

import { ExistentialWarning } from './ExistentialWarning';

const account = accounts['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'];

const signTransferTxPath = generatePath(paths.account.send.review, {
  address: account.address,
});

const signVestingTxPath = generatePath(paths.account.vest.sign, {
  address: account.address,
});

describe('ExistentialWarning', () => {
  it('should render with link to sign transfer screen', async () => {
    render(<ExistentialWarning nextPath={signTransferTxPath} />);

    const confirmationLink = await screen.findByRole('link', {
      name: 'Confirm',
    });

    expect(confirmationLink).toHaveAttribute(
      'href',
      '/account/4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire/send/review',
    );
  });
  it('should render with link to sign vesting screen', async () => {
    render(<ExistentialWarning nextPath={signVestingTxPath} />);

    const confirmationLink = await screen.findByRole('link', {
      name: 'Confirm',
    });

    expect(confirmationLink).toHaveAttribute(
      'href',
      '/account/4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire/vest/sign',
    );
  });
});
