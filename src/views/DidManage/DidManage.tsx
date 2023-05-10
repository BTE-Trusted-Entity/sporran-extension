import { Fragment, JSX } from 'react';
import { Link } from 'react-router-dom';
import { browser } from 'webextension-polyfill-ts';

import * as styles from './DidManage.module.css';

import { LinkBack } from '../../components/LinkBack/LinkBack';
import { Stats } from '../../components/Stats/Stats';
import { Identity } from '../../utilities/identities/types';
import { IdentitySlide } from '../../components/IdentitySlide/IdentitySlide';
import { CopyValue } from '../../components/CopyValue/CopyValue';
import { generatePath, paths } from '../paths';
import { useWeb3Name } from '../../utilities/useWeb3Name/useWeb3Name';

interface Props {
  identity: Identity;
}

export function DidManage({ identity }: Props): JSX.Element {
  const t = browser.i18n.getMessage;

  const { address, did } = identity;
  const web3name = useWeb3Name(did);

  const warningPath = web3name
    ? paths.identity.did.manage.downgrade.warning.web3name
    : paths.identity.did.manage.downgrade.warning.credentials;

  return (
    <section className={styles.container}>
      <h1 className={styles.heading}>{t('view_DidManage_heading')}</h1>

      <IdentitySlide identity={identity} />

      {did && (
        <Fragment>
          <CopyValue value={did} label="DID" className={styles.didLine} />

          {web3name && (
            <input
              value={web3name}
              aria-label="web3name"
              readOnly
              className={styles.web3NameLine}
            />
          )}

          <a
            className={styles.linking}
            href="https://linking.trusted-entity.io/"
            target="_blank"
            rel="noreferrer"
          >
            {t('view_DidManage_linking')}
          </a>

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
            to={generatePath(warningPath, { address })}
          >
            {t('view_DidManage_downgrade')}
          </Link>
        </Fragment>
      )}

      {/* One of the child sub-views uses the link form, so this view also has to use it. */}
      <LinkBack to={paths.identity.overview} />
      <Stats />
    </section>
  );
}
