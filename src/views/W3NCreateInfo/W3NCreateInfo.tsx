import { JSX } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { browser } from 'webextension-polyfill-ts';

import * as styles from './W3NCreateInfo.module.css';

import { Identity } from '../../utilities/identities/types';
import { getIdentityDid } from '../../utilities/identities/identities';
import { Stats } from '../../components/Stats/Stats';
import { LinkBack } from '../../components/LinkBack/LinkBack';
import { IdentitySlide } from '../../components/IdentitySlide/IdentitySlide';
import { CopyValue } from '../../components/CopyValue/CopyValue';
import { isFullDid } from '../../utilities/did/did';
import { generatePath, paths } from '../paths';

interface Props {
  identity: Identity;
}

export function W3NCreateInfo({ identity }: Props): JSX.Element {
  const t = browser.i18n.getMessage;
  const { goBack } = useHistory();

  const { address } = identity;
  const did = getIdentityDid(identity);

  const canContinue = isFullDid(did);

  return (
    <section className={styles.container}>
      <h1 className={styles.heading}>{t('view_W3NCreateInfo_heading')}</h1>
      <p className={styles.subline}>{t('view_W3NCreateInfo_subline')}</p>

      <IdentitySlide identity={identity} />

      {canContinue && (
        <CopyValue value={did} label="DID" className={styles.didLine} />
      )}

      <p className={styles.info}>{t('view_W3NCreateInfo_info')}</p>

      {!canContinue && (
        <p className={styles.warning}>{t('view_W3NCreateInfo_warning')}</p>
      )}

      <p className={styles.buttonsLine}>
        <button type="button" onClick={goBack} className={styles.back}>
          {t('common_action_back')}
        </button>

        {canContinue && (
          <Link
            to={generatePath(paths.identity.web3name.create.form, {
              address,
            })}
            className={styles.next}
          >
            {t('common_action_continue')}
          </Link>
        )}
        {!canContinue && (
          <Link
            to={generatePath(paths.identity.did.upgrade.start, { address })}
            className={styles.next}
          >
            {t('view_W3NCreateInfo_upgradeCTA')}
          </Link>
        )}
      </p>

      <LinkBack />
      <Stats />
    </section>
  );
}
