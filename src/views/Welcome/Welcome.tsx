import { useCallback, useState } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { Link, Redirect } from 'react-router-dom';

import {
  useAccounts,
  useCurrentAccount,
} from '../../utilities/accounts/accounts';
import { plural } from '../../utilities/plural/plural';
import { LinkBack } from '../../components/LinkBack/LinkBack';
import { generatePath, paths } from '../paths';

import styles from './Welcome.module.css';

interface Props {
  again?: boolean;
}

export function Welcome({ again = false }: Props): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const [enabled, setEnabled] = useState(false);
  const handleTermsClick = useCallback((event) => {
    setEnabled(event.target.checked);
  }, []);

  const handleLinkClick = useCallback(
    (event) => {
      if (!enabled) {
        event.preventDefault();
      }
    },
    [enabled],
  );

  const accounts = useAccounts();
  const current = useCurrentAccount();

  if (!accounts.data) {
    return null;
  }

  const accountsNumber = Object.values(accounts.data).length;
  const hasAccounts = accountsNumber > 0;

  if (current.data && hasAccounts && !again) {
    return (
      <Redirect
        to={generatePath(
          paths.account.overview,
          accounts.data[current.data] as { address: string },
        )}
      />
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>
        {hasAccounts ? t('view_Welcome_again') : t('view_Welcome_heading')}
      </h1>

      <h3 className={styles.info}>
        {hasAccounts
          ? plural(accountsNumber, {
              one: 'view_Welcome_hasOne',
              other: 'view_Welcome_hasOther',
            })
          : t('view_Welcome_noAccounts')}
      </h3>

      <p className={styles.termsLine}>
        <label className={styles.agreeLabel}>
          <input
            className={styles.agree}
            type="checkbox"
            onChange={handleTermsClick}
            checked={enabled}
          />
          <span />
          {t('view_Welcome_agree')}
        </label>
        <a
          className={styles.terms}
          href="https://example.com/TODO:"
          target="_blank"
          rel="noreferrer"
        >
          {t('view_Welcome_terms')}
        </a>
      </p>

      <Link
        to={paths.account.create.start}
        className={styles.create}
        onClick={handleLinkClick}
        aria-disabled={!enabled}
      >
        {t('view_Welcome_create')}
      </Link>

      <Link
        to={paths.account.import.start}
        className={styles.import}
        onClick={handleLinkClick}
        aria-disabled={!enabled}
      >
        {t('view_Welcome_import')}
      </Link>

      {again && <LinkBack />}
    </div>
  );
}
