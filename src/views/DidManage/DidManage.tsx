import { Link } from 'react-router-dom';
import { browser } from 'webextension-polyfill-ts';

import { useConfiguration } from '../../configuration/useConfiguration';
import { LinkBack } from '../../components/LinkBack/LinkBack';
import { Stats } from '../../components/Stats/Stats';
import { Identity } from '../../utilities/identities/types';
import { IdentitySlide } from '../../components/IdentitySlide/IdentitySlide';
import { YouHaveIdentities } from '../../components/YouHaveIdentities/YouHaveIdentities';
import { CopyValue } from '../../components/CopyValue/CopyValue';
import { generatePath, paths } from '../paths';

import * as styles from './DidManage.module.css';

interface Props {
  identity: Identity;
}

export function DidManage({ identity }: Props): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const { address } = identity;
  const { features } = useConfiguration();

  return (
    <section className={styles.container}>
      <h1 className={styles.heading}>{t('view_DidManage_heading')}</h1>
      <p className={styles.subline}>
        <YouHaveIdentities />
      </p>

      <IdentitySlide identity={identity} />

      <CopyValue value={identity.did} label="DID" className={styles.didLine} />

      <Link
        className={styles.endpoints}
        to={generatePath(paths.identity.did.endpoints.start, { address })}
      >
        {t('view_DidManage_endpoints')}
      </Link>

      {features.dotsama && (
        <Link
          className={styles.connect}
          to={generatePath(paths.identity.did.connect.start, { address })}
        >
          {t('view_DidManage_connect')}
        </Link>
      )}

      <Link
        className={styles.downgrade}
        to={generatePath(paths.identity.did.downgrade.start, { address })}
      >
        {t('view_DidManage_downgrade')}
      </Link>

      <LinkBack />
      <Stats />
    </section>
  );
}
