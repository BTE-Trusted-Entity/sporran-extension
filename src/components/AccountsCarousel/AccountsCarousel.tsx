import { Link } from 'react-router-dom';
import { sortBy } from 'lodash-es';

import {
  AccountsMap,
  Account as AccountType,
} from '../../utilities/accounts/accounts';
import { Account } from '../../views/Account/Account';
import { generatePath } from '../../views/paths';

interface AccountLinkProps {
  path: string;
  account: AccountType;
  accounts: AccountsMap;
  direction: 'previous' | 'next';
}

function AccountLink({
  path,
  account,
  accounts,
  direction,
}: AccountLinkProps): JSX.Element {
  const accountsList = sortBy(Object.values(accounts), 'index');
  const currentIndex = accountsList.indexOf(account);

  const delta = direction === 'previous' ? -1 : 1;
  const { length } = accountsList;
  const linkedIndex = (currentIndex + delta + length) % length;
  const linkedAccount = accountsList[linkedIndex];

  return (
    <Link
      to={generatePath(path, { address: linkedAccount.address })}
      title={linkedAccount.name}
      aria-label={linkedAccount.name}
    >
      {direction === 'previous' ? '←' : '→'}
    </Link>
  );
}

interface Props {
  path: string;
  accounts: AccountsMap;
  account: AccountType;
}

export function AccountsCarousel({
  account,
  accounts,
  path,
}: Props): JSX.Element {
  return (
    <>
      <AccountLink
        direction="previous"
        path={path}
        account={account}
        accounts={accounts}
      />

      <Account account={account} />

      <AccountLink
        direction="next"
        path={path}
        account={account}
        accounts={accounts}
      />
    </>
  );
}
