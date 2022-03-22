import { browser } from 'webextension-polyfill-ts';
import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';

import * as styles from './DidUpgradeExplainer.module.css';

import { Identity } from '../../utilities/identities/types';
import { paths, generatePath } from '../paths';

import { IdentitySlide } from '../../components/IdentitySlide/IdentitySlide';
import { Avatar } from '../../components/Avatar/Avatar';
import { LinkBack } from '../../components/LinkBack/LinkBack';
import { Stats } from '../../components/Stats/Stats';
import { useSwrDataOrThrow } from '../../utilities/useSwrDataOrThrow/useSwrDataOrThrow';
import { getPromoStatus } from '../../utilities/didUpgradePromo/didUpgradePromo';

interface Props {
  identity: Identity;
}

export function DidUpgradeExplainer({ identity }: Props): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const [promoChecked, setPromoChecked] = useState(false);

  const handleChecked = useCallback(() => {
    setPromoChecked(!promoChecked);
  }, [promoChecked]);

  const promoStatus = useSwrDataOrThrow('', getPromoStatus, 'getPromoStatus');

  if (!promoStatus) {
    return null; // backend data pending
  }

  const { account, remaining_dids, is_active } = promoStatus;

  const upgradePath = promoChecked
    ? generatePath(paths.identity.did.upgrade.promo, {
        address: identity.address,
        submitter: account,
      })
    : generatePath(paths.identity.did.upgrade.sign, {
        address: identity.address,
      });

  return (
    <section className={styles.container}>
      <h1 className={styles.heading}>
        {t('view_DidUpgradeExplainer_heading')}
      </h1>
      <p className={styles.subline}>{t('view_DidUpgradeExplainer_subline')}</p>

      <IdentitySlide identity={identity} />

      <div className={styles.functionality}>
        <Avatar className={styles.avatar} identity={identity} />
        {t('view_DidUpgradeExplainer_functionality')}
      </div>
      <p className={styles.deposit}>{t('view_DidUpgradeExplainer_deposit')}</p>

      {is_active && remaining_dids > 0 && (
        <label className={styles.promoLabel}>
          <input
            type="checkbox"
            className={styles.promo}
            onChange={handleChecked}
            checked={promoChecked}
          />
          <span />
          {t('view_DidUpgradeExplainer_promo')}
        </label>
      )}

      <p className={styles.buttonsLine}>
        <Link to={paths.home} className={styles.cancel}>
          {t('common_action_cancel')}
        </Link>
        <Link to={upgradePath} className={styles.upgrade}>
          {t('view_DidUpgradeExplainer_CTA')}
        </Link>
      </p>

      <LinkBack />
      <Stats />
    </section>
  );
}
