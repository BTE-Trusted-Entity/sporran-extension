import { Link } from 'react-router-dom';
import { browser } from 'webextension-polyfill-ts';
import { sortBy } from 'lodash-es';

import {
  Account,
  isNew,
  NEW,
  useAccounts,
} from '../../utilities/accounts/accounts';
import { AccountSlide } from '../AccountSlide/AccountSlide';
import { AccountSlideNew } from '../AccountSlide/AccountSlideNew';
import { generatePath } from '../../views/paths';

import styles from './AccountsCarousel.module.css';

interface AccountLinkProps {
  path: string;
  account: Account;
  direction: 'previous' | 'next';
}

function AccountLink({
  path,
  account,
  direction,
}: AccountLinkProps): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const accounts = useAccounts().data;
  if (!accounts) {
    return null;
  }

  const accountsList = sortBy(Object.values(accounts), 'index');
  const { length } = accountsList;

  const isPrevious = direction === 'previous';
  const delta = isPrevious ? -1 : 1;
  const modifiedIndex = !isNew(account)
    ? accountsList.indexOf(account) + delta
    : isPrevious
    ? length - 1
    : 0;

  const isInRange = 0 <= modifiedIndex && modifiedIndex < length;

  const linkedIndex = (modifiedIndex + length) % length;
  const linkedAccount = isInRange ? accountsList[linkedIndex] : NEW;
  const title = isInRange
    ? linkedAccount.name
    : t('component_AccountLink_title_new');

  return (
    <Link
      to={generatePath(path, { address: linkedAccount.address })}
      title={title}
      aria-label={title}
      className={isPrevious ? styles.left : styles.right}
    />
  );
}

interface Props {
  path: string;
  account: Account;
  nextTartan?: string;
}

export function AccountsCarousel({
  account,
  path,
  nextTartan,
}: Props): JSX.Element {
  return (
    <div className={styles.container}>
      <AccountLink direction="previous" path={path} account={account} />

      {isNew(account) && nextTartan ? (
        <AccountSlideNew nextTartan={nextTartan} />
      ) : (
        <AccountSlide account={account} />
      )}

      <AccountLink direction="next" path={path} account={account} />
    </div>
  );
}
