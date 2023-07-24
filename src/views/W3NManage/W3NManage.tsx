import { JSX } from 'react';
import { Link } from 'react-router-dom';
import browser from 'webextension-polyfill';

import * as styles from './W3NManage.module.css';

import { LinkBack } from '../../components/LinkBack/LinkBack';
import { Stats } from '../../components/Stats/Stats';
import { Identity } from '../../utilities/identities/types';
import { getIdentityDid } from '../../utilities/identities/identities';
import { IdentitySlide } from '../../components/IdentitySlide/IdentitySlide';
import { CopyValue } from '../../components/CopyValue/CopyValue';
import { generatePath, paths } from '../paths';
import { useWeb3Name } from '../../utilities/useWeb3Name/useWeb3Name';

interface Props {
  identity: Identity;
}

export function W3NManage({ identity }: Props): JSX.Element {
  const t = browser.i18n.getMessage;

  const { address } = identity;
  const did = getIdentityDid(identity);

  const web3name = useWeb3Name(did);

  return (
    <section className={styles.container}>
      <h1 className={styles.heading}>{t('view_W3NManage_heading')}</h1>

      <IdentitySlide identity={identity} />

      <CopyValue value={did} label="DID" className={styles.didLine} />

      {web3name && (
        <input
          value={web3name}
          aria-label="web3name"
          readOnly
          className={styles.web3NameLine}
        />
      )}

      {web3name && (
        <Link
          className={styles.remove}
          to={generatePath(paths.identity.web3name.manage.remove, { address })}
        >
          {t('view_W3NManage_remove')}
        </Link>
      )}

      <LinkBack />
      <Stats />
    </section>
  );
}
