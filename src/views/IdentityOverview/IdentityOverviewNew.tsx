import { browser } from 'webextension-polyfill-ts';
import { JSX } from 'react';
import { Link } from 'react-router-dom';

import * as styles from './IdentityOverview.module.css';

import { NEW } from '../../utilities/identities/identities';
import { paths } from '../paths';

import { YouHaveIdentities } from '../../components/YouHaveIdentities/YouHaveIdentities';
import { IdentitiesCarousel } from '../../components/IdentitiesCarousel/IdentitiesCarousel';
import { Stats } from '../../components/Stats/Stats';

export function IdentityOverviewNew(): JSX.Element | null {
  const t = browser.i18n.getMessage;

  return (
    <main className={styles.container}>
      <header>
        <h1 className={styles.heading}>{t('view_IdentityOverview_title')}</h1>
        <p className={styles.info}>
          <YouHaveIdentities />
        </p>
      </header>

      <IdentitiesCarousel identity={NEW} />

      <Link to={paths.identity.add} className={styles.add}>
        {t('view_IdentityOverview_add')}
      </Link>

      <Stats />
    </main>
  );
}
