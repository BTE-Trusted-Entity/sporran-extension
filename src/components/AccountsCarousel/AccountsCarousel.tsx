import { Link, NavLink } from 'react-router-dom';
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
  accountsList: Account[];
  direction: 'previous' | 'next';
}

function AccountLink({
  path,
  account,
  accountsList,
  direction,
}: AccountLinkProps): JSX.Element {
  const t = browser.i18n.getMessage;

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

const maxAccountBubbles = 5;

interface AccountsBubblesProps {
  accounts: Account[];
  path: string;
}

export function AccountsBubbles({
  accounts,
  path,
}: AccountsBubblesProps): JSX.Element | null {
  const t = browser.i18n.getMessage;

  if (accounts.length > maxAccountBubbles) {
    return null;
  }

  return (
    <ul className={styles.bubbles}>
      {accounts.map(({ name, address, index }) => (
        <li className={styles.item} key={index}>
          <NavLink
            className={styles.bubble}
            activeClassName={styles.bubbleActive}
            to={generatePath(path, { address: address })}
            aria-label={name}
            title={name}
          />
        </li>
      ))}
      <li className={styles.item}>
        <NavLink
          className={styles.add}
          activeClassName={styles.addActive}
          to={generatePath(path, { address: NEW.address })}
          aria-label={t('component_AccountsCarousel_title_new')}
          title={t('component_AccountsCarousel_title_new')}
        />
      </li>
    </ul>
  );
}

interface Props {
  path: string;
  account: Account;
}

export function AccountsCarousel({ account, path }: Props): JSX.Element | null {
  const accounts = useAccounts().data;
  if (!accounts) {
    return null;
  }

  const accountsList = sortBy(Object.values(accounts), 'index');

  return (
    <div className={styles.container}>
      {isNew(account) ? (
        <AccountSlideNew />
      ) : (
        <AccountSlide account={account} />
      )}

      <AccountLink
        direction="previous"
        path={path}
        account={account}
        accountsList={accountsList}
      />

      <AccountLink
        direction="next"
        path={path}
        account={account}
        accountsList={accountsList}
      />

      <AccountsBubbles accounts={accountsList} path={path} />
    </div>
  );
}
