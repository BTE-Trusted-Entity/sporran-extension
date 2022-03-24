import { browser } from 'webextension-polyfill-ts';
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
import { useBooleanState } from '../../utilities/useBooleanState/useBooleanState';

interface Props {
  identity: Identity;
}

export function DidUpgradeExplainer({ identity }: Props): JSX.Element {
  const t = browser.i18n.getMessage;

  const promoChecked = useBooleanState();

  const promoStatus = useSwrDataOrThrow('', getPromoStatus, 'getPromoStatus');

  const { address } = identity;

  const upgradePath = promoChecked.current
    ? generatePath(paths.identity.did.upgrade.promo, { address })
    : generatePath(paths.identity.did.upgrade.sign, { address });

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

      {promoStatus?.is_active && (
        <label className={styles.promoLabel}>
          <input
            type="checkbox"
            className={styles.promo}
            onChange={promoChecked.toggle}
            checked={promoChecked.current}
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
