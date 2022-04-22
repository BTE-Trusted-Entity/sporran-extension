import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { browser } from 'webextension-polyfill-ts';
import BN from 'bn.js';

import * as styles from './DidUpgradePromo.module.css';

import { Identity } from '../../utilities/identities/types';
import {
  PasswordField,
  usePasswordField,
} from '../../components/PasswordField/PasswordField';
import { saveIdentity } from '../../utilities/identities/identities';
import { IdentitySlide } from '../../components/IdentitySlide/IdentitySlide';
import { TxStatusModal } from '../../components/TxStatusModal/TxStatusModal';
import { LinkBack } from '../../components/LinkBack/LinkBack';
import { Stats } from '../../components/Stats/Stats';
import { KiltAmount } from '../../components/KiltAmount/KiltAmount';
import { paths } from '../paths';
import { getDidCreationDetails } from '../../utilities/getDidCreationDetails/getDidCreationDetails';
import {
  createDid,
  usePromoStatus,
  waitFinalized,
} from '../../utilities/promoBackend/promoBackend';

interface Props {
  identity: Identity;
}

export function DidUpgradePromo({ identity }: Props): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const [txHash, setTxHash] = useState<string>();

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'pending' | 'success' | 'error' | null>(
    null,
  );

  const promoStatus = usePromoStatus();

  const passwordField = usePasswordField();

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      const { seed } = await passwordField.get(event);

      try {
        if (!promoStatus) {
          throw new Error('Promo status data missing');
        }

        setSubmitting(true);
        setStatus('pending');

        const creationDetails = await getDidCreationDetails(
          seed,
          promoStatus.account,
        );

        const { tx_hash } = await createDid(creationDetails);
        setTxHash(tx_hash);

        const finalized = await waitFinalized(tx_hash);
        if (!finalized) {
          throw new Error('Error finalizing transaction');
        }

        const { did } = creationDetails;
        await saveIdentity({ ...identity, did });

        setStatus('success');
      } catch (error) {
        setSubmitting(false);
        setStatus('error');
        console.error(error);
      }
    },
    [identity, passwordField, promoStatus],
  );

  const closeModal = useCallback(() => {
    setStatus(null);
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.container}
      autoComplete="off"
    >
      <h1 className={styles.heading}>{t('view_DidUpgradePromo_heading')}</h1>
      <p className={styles.subline}>{t('view_DidUpgradePromo_subline')}</p>

      <IdentitySlide identity={identity} />

      <p className={styles.costs}>
        {t('view_DidUpgradePromo_total')}
        <KiltAmount amount={new BN(0)} type="costs" smallDecimals />
      </p>

      <p className={styles.info}>{t('view_DidUpgradePromo_info')}</p>

      <PasswordField identity={identity} autoFocus password={passwordField} />

      <p className={styles.buttonsLine}>
        <Link to={paths.home} className={styles.cancel}>
          {t('common_action_cancel')}
        </Link>
        {promoStatus && (
          <button type="submit" className={styles.submit} disabled={submitting}>
            {t('common_action_sign')}
          </button>
        )}
      </p>

      {status && (
        <TxStatusModal
          identity={identity}
          status={status}
          txHash={txHash}
          onDismissError={closeModal}
          messages={{
            pending: t('view_DidUpgradePromo_pending'),
            success: t('view_DidUpgradePromo_success'),
            error: t('view_DidUpgradePromo_error'),
          }}
        />
      )}

      <LinkBack />
      <Stats />
    </form>
  );
}
