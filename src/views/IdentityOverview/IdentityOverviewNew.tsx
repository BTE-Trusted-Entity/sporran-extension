import browser from 'webextension-polyfill';
import { Link } from 'react-router-dom';

import * as styles from './IdentityOverview.module.css';

import { NEW } from '../../utilities/identities/identities';
import { paths } from '../paths';

import { YouHaveIdentities } from '../../components/YouHaveIdentities/YouHaveIdentities';
import { IdentitiesCarousel } from '../../components/IdentitiesCarousel/IdentitiesCarousel';

export function IdentityOverviewNew() {
  const t = browser.i18n.getMessage;

  return (
    <main className={styles.container}>
      <header>
        <h1 className={styles.heading}>{t('view_IdentityOverview_title')}</h1>
        <p className={styles.subline}>
          <YouHaveIdentities />
        </p>
      </header>

      <IdentitiesCarousel identity={NEW} />

      <Link to={paths.identity.add} className={styles.add}>
        {t('view_IdentityOverview_add')}
      </Link>
    </main>
  );
}
