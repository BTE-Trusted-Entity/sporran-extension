import { Link } from 'react-router-dom';
import { browser } from 'webextension-polyfill-ts';
import { sortBy } from 'lodash-es';

import {
  AccountsMap,
  Account,
  isNew,
  NEW,
} from '../../utilities/accounts/accounts';
import { AccountSlide } from '../AccountSlide/AccountSlide';
import { AccountSlideNew } from '../AccountSlide/AccountSlideNew';
import { generatePath } from '../../views/paths';

interface AccountLinkProps {
  path: string;
  account: Account;
  accounts: AccountsMap;
  direction: 'previous' | 'next';
}

function AccountLink({
  path,
  account,
  accounts,
  direction,
}: AccountLinkProps): JSX.Element {
  const t = browser.i18n.getMessage;

  const accountsList = sortBy(Object.values(accounts), 'index');
  const { length } = accountsList;

  const isPrevious = direction === 'previous';
  const currentIndex = !isNew(account)
    ? accountsList.indexOf(account)
    : isPrevious
    ? length
    : -1;

  const delta = isPrevious ? -1 : 1;

  const modifiedIndex = currentIndex + delta;
  const isInRange = 0 <= modifiedIndex && modifiedIndex < length;

  const linkedIndex = (modifiedIndex + length) % length;
  const linkedAccount = isInRange ? accountsList[linkedIndex] : NEW;
  const title = isInRange
    ? linkedAccount.name
    : t('component_AccountLink_title');

  return (
    <Link
      to={generatePath(path, { address: linkedAccount.address })}
      title={title}
      aria-label={title}
    >
      {isPrevious ? '←' : '→'}
    </Link>
  );
}

interface Props {
  path: string;
  accounts: AccountsMap;
  account: Account;
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

      {isNew(account) ? (
        <AccountSlideNew />
      ) : (
        <AccountSlide account={account} />
      )}

      <AccountLink
        direction="next"
        path={path}
        account={account}
        accounts={accounts}
      />
    </>
  );
}
