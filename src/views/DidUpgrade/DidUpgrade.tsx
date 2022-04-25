import { useCallback, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import BN from 'bn.js';
import { browser } from 'webextension-polyfill-ts';

import { IDidDetails } from '@kiltprotocol/types';

import * as styles from './DidUpgrade.module.css';

import { Identity } from '../../utilities/identities/types';
import {
  PasswordField,
  usePasswordField,
} from '../../components/PasswordField/PasswordField';
import { getFee, sign, submit } from '../../utilities/didUpgrade/didUpgrade';
import { saveIdentity } from '../../utilities/identities/identities';
import { IdentitySlide } from '../../components/IdentitySlide/IdentitySlide';
import { useAddressBalance } from '../../components/Balance/Balance';
import { KiltCurrency } from '../../components/KiltCurrency/KiltCurrency';
import {
  asKiltCoins,
  KiltAmount,
} from '../../components/KiltAmount/KiltAmount';
import { TxStatusModal } from '../../components/TxStatusModal/TxStatusModal';
import { LinkBack } from '../../components/LinkBack/LinkBack';
import { ExplainerModal } from '../../components/ExplainerModal/ExplainerModal';
import { Stats } from '../../components/Stats/Stats';
import { paths } from '../paths';
import { useAsyncValue } from '../../utilities/useAsyncValue/useAsyncValue';
import { getDepositDid } from '../../utilities/getDeposit/getDeposit';
import { PasswordError } from '../../utilities/storageEncryption/storageEncryption';

interface Props {
  identity: Identity;
}

function useCosts(
  address: string,
  did: IDidDetails['did'],
): {
  fee?: BN;
  deposit?: BN;
  total?: BN;
  error: boolean;
} {
  const fee = useAsyncValue(getFee, []);
  const deposit = useAsyncValue(getDepositDid, [did]);

  const total = useMemo(
    () => (fee && deposit ? fee.add(deposit.amount) : undefined),
    [deposit, fee],
  );

  const balance = useAddressBalance(address);
  const error = Boolean(total && balance && balance.transferable.lt(total));

  return { fee, deposit: deposit?.amount, total, error };
}

export function DidUpgrade({ identity }: Props): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const { address, did } = identity;
  const { fee, deposit, total, error } = useCosts(address, did);
  const [txHash, setTxHash] = useState<string>();

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'pending' | 'success' | 'error' | null>(
    null,
  );

  const passwordField = usePasswordField();

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      try {
        const { seed } = await passwordField.get(event);

        setSubmitting(true);
        setStatus('pending');

        const hash = await sign(identity, seed);
        setTxHash(hash);

        const did = await submit(hash);
        await saveIdentity({ ...identity, did });

        setStatus('success');
      } catch (error) {
        if (error instanceof PasswordError) {
          return;
        }
        setSubmitting(false);
        setStatus('error');
      }
    },
    [identity, passwordField],
  );

  const closeModal = useCallback(() => {
    setStatus(null);
  }, []);

  const portalRef = useRef<HTMLDivElement>(null);

  if (!(fee && deposit && total)) {
    return null; // blockchain data pending
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.container}
      autoComplete="off"
    >
      <h1 className={styles.heading}>{t('view_DidUpgrade_heading')}</h1>
      <p className={styles.subline}>{t('view_DidUpgrade_subline')}</p>

      <IdentitySlide identity={identity} />

      <p className={styles.costs}>
        {t('view_DidUpgrade_total')}
        <KiltAmount amount={total} type="costs" smallDecimals />
      </p>
      <p className={styles.details}>
        <ExplainerModal label={t('view_DidUpgrade_info')} portalRef={portalRef}>
          {t('view_DidUpgrade_deposit_explainer')}
        </ExplainerModal>
        {t('view_DidUpgrade_deposit')}
        {asKiltCoins(deposit, 'costs')} <KiltCurrency />
        {t('view_DidUpgrade_fee')}
        {asKiltCoins(fee, 'costs')} <KiltCurrency />
      </p>

      <PasswordField identity={identity} autoFocus password={passwordField} />

      <p className={styles.buttonsLine}>
        <Link to={paths.home} className={styles.cancel}>
          {t('common_action_cancel')}
        </Link>
        <button
          type="submit"
          className={styles.submit}
          disabled={submitting || error}
        >
          {t('common_action_sign')}
        </button>
        <output
          className={styles.errorTooltip}
          hidden={!error || Boolean(status)}
        >
          {t('view_DidUpgrade_insufficientFunds', [
            asKiltCoins(total, 'costs'),
          ])}
        </output>
      </p>

      {status && (
        <TxStatusModal
          identity={identity}
          status={status}
          txHash={txHash}
          onDismissError={closeModal}
          messages={{
            pending: t('view_DidUpgrade_pending'),
            success: t('view_DidUpgrade_success'),
            error: t('view_DidUpgrade_error'),
          }}
        />
      )}

      <div ref={portalRef} />

      <LinkBack />
      <Stats />
    </form>
  );
}
