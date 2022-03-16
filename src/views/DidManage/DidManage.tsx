import { Link } from 'react-router-dom';
import { browser } from 'webextension-polyfill-ts';

import * as styles from './DidManage.module.css';

import { LinkBack } from '../../components/LinkBack/LinkBack';
import { Stats } from '../../components/Stats/Stats';
import { Identity } from '../../utilities/identities/types';
import { IdentitySlide } from '../../components/IdentitySlide/IdentitySlide';
import { YouHaveIdentities } from '../../components/YouHaveIdentities/YouHaveIdentities';
import { CopyValue } from '../../components/CopyValue/CopyValue';
import { generatePath, paths } from '../paths';

interface Props {
  identity: Identity;
}

export function DidManage({ identity }: Props): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const { address } = identity;

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
        to={generatePath(paths.identity.did.manage.endpoints.start, {
          address,
        })}
      >
        {t('view_DidManage_endpoints')}
      </Link>

      <Link
        className={styles.downgrade}
        to={generatePath(paths.identity.did.manage.warning, { address })}
      >
        {t('view_DidManage_downgrade')}
      </Link>

      {/* One of the child sub-views uses the link form, so this view also has to use it. */}
      <LinkBack to={paths.identity.overview} />
      <Stats />
    </section>
  );
}
