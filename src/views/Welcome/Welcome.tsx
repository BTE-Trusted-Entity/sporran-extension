import { browser } from 'webextension-polyfill-ts';
import { Link, Redirect } from 'react-router-dom';

import {
  useAccounts,
  useCurrentAccount,
} from '../../utilities/accounts/accounts';
import { generatePath, paths } from '../paths';

import styles from './Welcome.module.css';

export function Welcome(): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const accounts = useAccounts();
  const hasAccounts = accounts.data && Object.values(accounts.data).length > 0;
  const current = useCurrentAccount();

  if (!accounts.data) {
    return null;
  }

  if (current.data && hasAccounts) {
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
      <div className={styles.logo}>
        <h3>[Insert logo here]</h3>
      </div>
      <h1>{t('view_Welcome_heading')}</h1>

      <h3 className={styles.info}>{t('view_Welcome_info')}</h3>
      <h3 className={styles.info}>{t('view_Welcome_invitation')}</h3>

      <Link to={paths.account.create.start} className={styles.buttonContainer}>
        {t('view_Welcome_create')}
      </Link>

      <Link to={paths.account.import.start}>{t('view_Welcome_import')}</Link>
    </div>
  );
}
