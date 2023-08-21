import { FormEvent, useCallback, useState } from 'react';
import BN from 'bn.js';
import browser from 'webextension-polyfill';
import { Link } from 'react-router-dom';

import * as styles from './ReviewTransaction.module.css';

import {
  signTransfer,
  submitTransfer,
} from '../../utilities/transfers/transfers';

import { useBooleanState } from '../../utilities/useBooleanState/useBooleanState';
import { Identity } from '../../utilities/identities/types';
import { Stats } from '../../components/Stats/Stats';
import { LinkBack } from '../../components/LinkBack/LinkBack';
import { IdentitySlide } from '../../components/IdentitySlide/IdentitySlide';
import { KiltAmount } from '../../components/KiltAmount/KiltAmount';
import { TxStatusModal } from '../../components/TxStatusModal/TxStatusModal';
import {
  PasswordError,
  PasswordField,
  usePasswordField,
} from '../../components/PasswordField/PasswordField';
import { paths } from '../paths';

interface Props {
  identity: Identity;
  recipient: string;
  amount: BN;
  fee: BN;
  tip: BN;
}

export function ReviewTransaction({
  identity,
  recipient,
  amount,
  fee,
  tip,
}: Props) {
  const t = browser.i18n.getMessage;

  const showDetails = useBooleanState();

  const passwordField = usePasswordField();

  const [submitting, setSubmitting] = useState(false);

  const [txStatus, setTxStatus] = useState<
    'pending' | 'success' | 'error' | null
  >(null);

  const [txHash, setTxHash] = useState<string>();

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      try {
        const { keypair } = await passwordField.get(event);

        setSubmitting(true);
        setTxStatus('pending');

        const hash = await signTransfer({
          recipient,
          amount,
          tip,
          keypair,
        });
        setTxHash(hash);

        await submitTransfer(hash);

        setTxStatus('success');
      } catch (error) {
        if (error instanceof PasswordError) {
          return;
        }
        setTxStatus('error');
        setSubmitting(false);
      }
    },
    [passwordField, amount, recipient, tip],
  );

  const totalFee = fee.add(tip);
  const total = amount.add(totalFee);

  const closeModal = useCallback(() => {
    setTxStatus(null);
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.container}
      autoComplete="off"
    >
      <h1 className={styles.heading}>{t('view_ReviewTransaction_heading')}</h1>
      <p className={styles.subline}>{t('view_ReviewTransaction_subline')}</p>

      <IdentitySlide identity={identity} />

      <p className={styles.recipient}>
        {t('view_ReviewTransaction_recipient')}
      </p>
      <p className={styles.address}>{recipient}</p>

      <p className={styles.totalLine}>
        <span>{t('view_ReviewTransaction_total')}</span>
        <KiltAmount amount={total} type="costs" smallDecimals />

        {showDetails.current ? (
          <button
            onClick={showDetails.off}
            type="button"
            className={styles.hideDetails}
            title={t('view_ReviewTransaction_hideDetails')}
            aria-label={t('view_ReviewTransaction_hideDetails')}
          />
        ) : (
          <button
            onClick={showDetails.on}
            type="button"
            className={styles.showDetails}
            title={t('view_ReviewTransaction_showDetails')}
            aria-label={t('view_ReviewTransaction_showDetails')}
          />
        )}
      </p>

      <table
        className={showDetails.current ? styles.details : styles.detailsHidden}
      >
        <thead>
          <tr>
            <th className={styles.detailName}>
              {t('view_ReviewTransaction_fee')}
            </th>
            <th className={styles.detailName}>
              {t('view_ReviewTransaction_tip')}
            </th>
            <th className={styles.detailName}>
              {t('view_ReviewTransaction_totalFee')}
            </th>
            <th className={styles.detailName}>
              {t('view_ReviewTransaction_amount')}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <KiltAmount amount={fee} type="costs" />
            </td>
            <td>
              <KiltAmount amount={tip} type="costs" />
            </td>
            <td>
              <KiltAmount amount={totalFee} type="costs" />
            </td>
            <td>
              <KiltAmount amount={amount} type="funds" />
            </td>
          </tr>
        </tbody>
      </table>

      <PasswordField identity={identity} autoFocus password={passwordField} />

      <p className={styles.buttonsLine}>
        <Link to={paths.home} className={styles.cancel}>
          {t('common_action_cancel')}
        </Link>
        <button type="submit" className={styles.submit} disabled={submitting}>
          {t('view_ReviewTransaction_CTA')}
        </button>
      </p>

      {txStatus && (
        <TxStatusModal
          identity={identity}
          status={txStatus}
          txHash={txHash}
          onDismissError={closeModal}
        />
      )}

      <LinkBack />
      <Stats />
    </form>
  );
}
