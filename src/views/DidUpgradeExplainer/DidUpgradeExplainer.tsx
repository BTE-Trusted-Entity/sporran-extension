import { browser } from 'webextension-polyfill-ts';
import { Link } from 'react-router-dom';
import { Fragment } from 'react';

import * as styles from './DidUpgradeExplainer.module.css';

import { Identity } from '../../utilities/identities/types';
import { generatePath, paths } from '../paths';

import { IdentitySlide } from '../../components/IdentitySlide/IdentitySlide';
import { Avatar } from '../../components/Avatar/Avatar';
import { LinkBack } from '../../components/LinkBack/LinkBack';
import { Stats } from '../../components/Stats/Stats';
import { useDidDeletionStatus } from '../../utilities/did/useDidDeletionStatus';
import { usePromoStatus } from '../../utilities/promoBackend/promoBackend';
import { useBooleanState } from '../../utilities/useBooleanState/useBooleanState';

interface Props {
  identity: Identity;
}

export function DidUpgradeExplainer({ identity }: Props): JSX.Element {
  const t = browser.i18n.getMessage;

  const promoChecked = useBooleanState();
  const promoStatus = usePromoStatus();

  const { address, did } = identity;

  const upgradePath = promoChecked.current
    ? generatePath(paths.identity.did.upgrade.promo, { address })
    : generatePath(paths.identity.did.upgrade.sign, { address });

  const wasOnChainDidDeleted = useDidDeletionStatus(did);

  return (
    <section className={styles.container}>
      <h1 className={styles.heading}>
        {t('view_DidUpgradeExplainer_heading')}
      </h1>
      <p className={styles.subline}>{t('view_DidUpgradeExplainer_subline')}</p>

      <IdentitySlide identity={identity} />

      {wasOnChainDidDeleted && (
        <Fragment>
          <p className={styles.deleted}>
            {t('view_DidUpgradeExplainer_onchain_deleted')}
          </p>
          <Link to={paths.home} className={styles.back}>
            {t('common_action_back')}
          </Link>
        </Fragment>
      )}

      {!wasOnChainDidDeleted && (
        <Fragment>
          <div className={styles.functionality}>
            <Avatar className={styles.avatar} identity={identity} />
            {t('view_DidUpgradeExplainer_functionality')}
          </div>
          <p className={styles.deposit}>
            {t('view_DidUpgradeExplainer_deposit')}
          </p>

          {promoStatus?.is_active && (
            <p className={styles.promoLine}>
              <label>
                <input
                  type="checkbox"
                  className={styles.promo}
                  onChange={promoChecked.toggle}
                  checked={promoChecked.current}
                />
                <span />
                {t('view_DidUpgradeExplainer_promo')}
              </label>
              <a
                className={styles.terms}
                href="https://www.trusted-entity.io/assets/pdf/web3namePromo_Terms_2022.pdf"
                target="_blank"
                rel="noreferrer"
              >
                {t('view_DidUpgradeExplainer_terms')}
              </a>
            </p>
          )}
          <p className={styles.buttonsLine}>
            <Link to={paths.home} className={styles.cancel}>
              {t('common_action_cancel')}
            </Link>
            <Link
              to={upgradePath}
              className={styles.upgrade}
              aria-disabled={wasOnChainDidDeleted}
            >
              {t('view_DidUpgradeExplainer_CTA')}
            </Link>
          </p>
        </Fragment>
      )}

      <LinkBack />
      <Stats />
    </section>
  );
}
