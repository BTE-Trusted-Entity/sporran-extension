import { Link } from 'react-router-dom';
import { browser } from 'webextension-polyfill-ts';

import { Web3Names } from '@kiltprotocol/did';

import * as styles from './DidManage.module.css';

import { LinkBack } from '../../components/LinkBack/LinkBack';
import { Stats } from '../../components/Stats/Stats';
import { Identity } from '../../utilities/identities/types';
import { IdentitySlide } from '../../components/IdentitySlide/IdentitySlide';
import { YouHaveIdentities } from '../../components/YouHaveIdentities/YouHaveIdentities';
import { CopyValue } from '../../components/CopyValue/CopyValue';
import { generatePath, paths } from '../paths';
import { useSwrDataOrThrow } from '../../utilities/useSwrDataOrThrow/useSwrDataOrThrow';

interface Props {
  identity: Identity;
}

export function DidManage({ identity }: Props): JSX.Element {
  const t = browser.i18n.getMessage;

  const { address, did } = identity;
  const web3name = useSwrDataOrThrow(
    did,
    Web3Names.queryWeb3NameForDid,
    'Web3Names.queryWeb3NameForDid',
  );
  return (
    <section className={styles.container}>
      <h1 className={styles.heading}>{t('view_DidManage_heading')}</h1>
      <p className={styles.subline}>
        <YouHaveIdentities />
      </p>

      <IdentitySlide identity={identity} />

      <CopyValue value={identity.did} label="DID" className={styles.didLine} />

      {web3name && (
        <input
          value={web3name}
          aria-label="web3name"
          readOnly
          className={styles.web3NameLine}
        />
      )}

      <Link
        className={styles.endpoints}
        to={generatePath(paths.identity.did.manage.endpoints.start, {
          address,
        })}
      >
        {t('view_DidManage_endpoints')}
      </Link>

      {!web3name && (
        <Link
          className={styles.web3Name}
          to={generatePath(paths.identity.did.web3name.create.info, {
            address,
          })}
        >
          {t('view_DidManage_web3name')}
        </Link>
      )}

      {web3name && (
        <Link
          className={styles.web3Name}
          to={generatePath(paths.identity.did.web3name.remove, { address })}
        >
          {t('view_DidManage_web3name_remove')}
        </Link>
      )}

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
