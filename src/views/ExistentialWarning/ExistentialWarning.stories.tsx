import { Meta } from '@storybook/react';

import { accountsMock as accounts } from '../../utilities/accounts/AccountsProvider.mock';
import { paths, generatePath } from '../paths';

import { ExistentialWarning } from './ExistentialWarning';

export default {
  title: 'Views/ExistentialWarning',
  component: ExistentialWarning,
} as Meta;

const account = accounts['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'];

export function Template(): JSX.Element {
  return (
    <ExistentialWarning
      path={generatePath(paths.account.send.review, {
        address: account.address,
      })}
    />
  );
}
