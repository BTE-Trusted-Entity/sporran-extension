import { browser } from 'webextension-polyfill-ts';
import { Link, Redirect } from 'react-router-dom';

import { AccountsMap } from '../../utilities/accounts/accounts';
import { generatePath, paths } from '../paths';

import styles from './Welcome.module.css';

interface Props {
  accounts?: AccountsMap;
  current?: string | null;
}

export function Welcome({ accounts, current }: Props): JSX.Element | null {
  const t = browser.i18n.getMessage;

  if (accounts && current && Object.values(accounts).length > 0) {
    return (
      <Redirect
        to={generatePath(
          paths.account.overview,
          accounts[current] as { address: string },
        )}
      />
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>{t('view_Welcome_heading')}</h1>

      <h3 className={styles.info}>{t('view_Welcome_info')}</h3>
      <h3 className={styles.info}>{t('view_Welcome_invitation')}</h3>

      <Link to={paths.account.create.start} className={styles.create}>
        {t('view_Welcome_create')}
      </Link>

      <Link to={paths.account.import.start} className={styles.import}>
        {t('view_Welcome_import')}
      </Link>
    </div>
  );
}
