import { Link, useHistory } from 'react-router-dom';
import { browser } from 'webextension-polyfill-ts';

import * as styles from './W3NCreateInfo.module.css';

import { Identity } from '../../utilities/identities/types';
import { Stats } from '../../components/Stats/Stats';
import { LinkBack } from '../../components/LinkBack/LinkBack';
import { IdentitySlide } from '../../components/IdentitySlide/IdentitySlide';
import { CopyValue } from '../../components/CopyValue/CopyValue';
import { isFullDid } from '../../utilities/did/did';
import { generatePath, paths } from '../paths';
import { useSwrDataOrThrow } from '../../utilities/useSwrDataOrThrow/useSwrDataOrThrow';
import { getPromoStatus } from '../../utilities/didUpgradePromo/didUpgradePromo';

interface Props {
  identity: Identity;
  hasPromo: boolean;
  togglePromo: () => void;
}

export function W3NCreateInfo({
  identity,
  hasPromo,
  togglePromo,
}: Props): JSX.Element {
  const t = browser.i18n.getMessage;
  const { goBack } = useHistory();

  const { address } = identity;
  const canContinue = isFullDid(identity.did);

  const promoStatus = useSwrDataOrThrow('', getPromoStatus, 'getPromoStatus');

  return (
    <section className={styles.container}>
      <h1 className={styles.heading}>{t('view_W3NCreateInfo_heading')}</h1>
      <p className={styles.subline}>{t('view_W3NCreateInfo_subline')}</p>

      <IdentitySlide identity={identity} />

      {canContinue && (
        <CopyValue
          value={identity.did}
          label="DID"
          className={styles.didLine}
        />
      )}

      <p className={styles.info}>{t('view_W3NCreateInfo_info')}</p>

      {!canContinue && (
        <p className={styles.warning}>{t('view_W3NCreateInfo_warning')}</p>
      )}

      {canContinue && promoStatus?.is_active && (
        <label className={styles.promoLabel}>
          <input
            type="checkbox"
            className={styles.promo}
            onChange={togglePromo}
            checked={hasPromo}
          />
          <span />
          {t('view_DidUpgradeExplainer_promo')}
        </label>
      )}

      <p className={styles.buttonsLine}>
        <button type="button" onClick={goBack} className={styles.back}>
          {t('common_action_back')}
        </button>

        {canContinue && (
          <Link
            to={generatePath(paths.identity.did.web3name.create.form, {
              address,
            })}
            className={styles.next}
          >
            {t('common_action_next')}
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
