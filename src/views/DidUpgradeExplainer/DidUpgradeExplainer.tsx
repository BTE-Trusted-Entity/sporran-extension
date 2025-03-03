import browser from 'webextension-polyfill';
import { Link } from 'react-router-dom';
import {
  ChangeEvent,
  Fragment,
  useCallback,
  // useEffect,
  useRef,
  useState,
} from 'react';

import * as styles from './DidUpgradeExplainer.module.css';

import { Identity } from '../../utilities/identities/types';
import { generatePath, paths } from '../paths';

import { IdentitySlide } from '../../components/IdentitySlide/IdentitySlide';
import { Avatar } from '../../components/Avatar/Avatar';
import { CopyValue } from '../../components/CopyValue/CopyValue';
import { LinkBack } from '../../components/LinkBack/LinkBack';
import { Stats } from '../../components/Stats/Stats';
import { useIsOnChainDidDeleted } from '../../utilities/did/useIsOnChainDidDeleted';
import { ExplainerModal } from '../../components/ExplainerModal/ExplainerModal';
import { useKiltCosts } from '../../utilities/didUpgrade/didUpgrade';
import { asKiltCoins } from '../../components/KiltAmount/KiltAmount';
import { useAsyncValue } from '../../utilities/useAsyncValue/useAsyncValue';
import { getCheckoutCosts } from '../../utilities/checkout/checkout';

type PaymentMethod = 'kilt' | 'euro';

interface Props {
  identity: Identity;
}

export function DidUpgradeExplainer({ identity }: Props) {
  const t = browser.i18n.getMessage;

  const { address, did, deletedDid } = identity;

  const wasOnChainDidDeleted = useIsOnChainDidDeleted(did);

  const { total: kiltCosts, insufficientKilt } = useKiltCosts(address, did);

  const euroCost = useAsyncValue(getCheckoutCosts, [])?.did;

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('kilt');

  // useEffect(() => {
  //   if (insufficientKilt) {
  //     setPaymentMethod('euro');
  //   }
  // }, [insufficientKilt]);

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(event.target.value as PaymentMethod);
  }, []);

  const portalRef = useRef<HTMLDivElement>(null);

  if (wasOnChainDidDeleted === undefined) {
    return null; // blockchain data pending
  }

  if (!kiltCosts) {
    return null; // blockchain data pending
  }

  if (!euroCost) {
    return null; // network data pending
  }

  return (
    <form className={styles.container}>
      <h1 className={styles.heading}>
        {t('view_DidUpgradeExplainer_heading')}
      </h1>

      {(wasOnChainDidDeleted || !did) && (
        <Fragment>
          <p className={styles.subline}>
            {t('view_DidUpgradeExplainer_onchain_deleted_subline')}
          </p>

          <IdentitySlide identity={identity} />

          {deletedDid && (
            <CopyValue
              value={deletedDid}
              label="DID"
              className={styles.didLine}
            />
          )}
          <p className={styles.deleted}>
            {t('view_DidUpgradeExplainer_onchain_deleted')}
          </p>
          <Link to={paths.home} className={styles.back}>
            {t('common_action_back')}
          </Link>
        </Fragment>
      )}

      {!wasOnChainDidDeleted && did && (
        <Fragment>
          <p className={styles.subline}>
            {t('view_DidUpgradeExplainer_subline')}
          </p>

          <IdentitySlide identity={identity} />

          <div className={styles.functionality}>
            <Avatar className={styles.avatar} identity={identity} />
            {t('view_DidUpgradeExplainer_functionality')}
          </div>
          <p className={styles.deposit}>
            {t('view_DidUpgradeExplainer_deposit')}
          </p>

          <section
            className={
              insufficientKilt
                ? styles.paymentMethodsError
                : styles.paymentMethods
            }
          >
            <p className={styles.paymentMethod}>
              <label
                className={
                  insufficientKilt ? styles.insufficientKilt : styles.kilt
                }
              >
                <input
                  type="radio"
                  name="payment"
                  value="kilt"
                  checked={paymentMethod === 'kilt'}
                  onChange={handleChange}
                  className={styles.select}
                  disabled={insufficientKilt}
                />

                {t('view_DidUpgradeExplainer_kilt')}
              </label>

              <ExplainerModal
                label={t('view_DidUpgradeExplainer_kilt_info')}
                portalRef={portalRef}
              >
                {t('view_DidUpgradeExplainer_kilt_explainer')}
              </ExplainerModal>

              <output
                className={styles.errorTooltip}
                hidden={!insufficientKilt}
              >
                {t('view_DidUpgradeExplainer_insufficientKilt', [
                  asKiltCoins(kiltCosts, 'costs'),
                ])}
              </output>
            </p>

            <p className={styles.paymentMethod}>
              <label className={styles.insufficientKilt}>
                <input
                  type="radio"
                  name="payment"
                  value="euro"
                  // checked={paymentMethod === 'euro'}
                  onChange={handleChange}
                  className={styles.select}
                  disabled={insufficientKilt || true}
                />
                {t('view_DidUpgradeExplainer_euro', [euroCost])}
              </label>

              <ExplainerModal
                label={t('view_DidUpgradeExplainer_euro_info')}
                portalRef={portalRef}
              >
                {t('view_DidUpgradeExplainer_euro_explainer')}
              </ExplainerModal>
            </p>
          </section>

          <p className={styles.buttonsLine}>
            <Link to={paths.home} className={styles.cancel}>
              {t('common_action_cancel')}
            </Link>
            <Link
              to={generatePath(paths.identity.did.upgrade[paymentMethod], {
                address,
              })}
              className={styles.upgrade}
              aria-disabled={wasOnChainDidDeleted || insufficientKilt}
            >
              {t('common_action_continue')}
            </Link>
          </p>
        </Fragment>
      )}

      <div ref={portalRef} />

      <LinkBack />
      <Stats />
    </form>
  );
}
