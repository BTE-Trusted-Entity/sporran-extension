import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import BN from 'bn.js';
import { browser } from 'webextension-polyfill-ts';

import { Identity } from '../../utilities/identities/types';
import {
  PasswordField,
  usePasswordField,
} from '../../components/PasswordField/PasswordField';
import {
  getDeposit,
  getFee,
  sign,
  submit,
} from '../../utilities/didUpgrade/didUpgrade';
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
import { Stats } from '../../components/Stats/Stats';
import { generatePath, paths } from '../paths';

import * as styles from './DidUpgrade.module.css';

interface Props {
  identity: Identity;
}

function useCosts(address: string): {
  fee?: BN;
  deposit?: BN;
  total?: BN;
  error: boolean;
} {
  const [fee, setFee] = useState<BN | undefined>();
  const [deposit, setDeposit] = useState<BN | undefined>();

  useEffect(() => {
    (async () => {
      setFee(await getFee());
      setDeposit(await getDeposit());
    })();
  }, []);

  const total = useMemo(
    () => (fee && deposit ? fee.add(deposit) : undefined),
    [deposit, fee],
  );

  const balance = useAddressBalance(address);
  const error = Boolean(total && balance && balance.transferable.lt(total));

  return { fee, deposit, total, error };
}

export function DidUpgrade({ identity }: Props): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const { address } = identity;
  const { fee, deposit, total, error } = useCosts(address);
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
        const password = await passwordField.get(event);

        setSubmitting(true);
        setStatus('pending');

        const hash = await sign(identity, password);
        setTxHash(hash);

        const did = await submit(hash);
        await saveIdentity({ ...identity, did });

        setStatus('success');
      } catch (error) {
        setSubmitting(false);
        setStatus('error');
      }
    },
    [identity, passwordField],
  );

  const closeModal = useCallback(() => {
    setStatus(null);
  }, []);

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
        <Link
          to={generatePath(paths.identity.did.upgrade.start, { address })}
          className={styles.info}
          aria-label={t('view_DidUpgrade_info')}
        />
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
          {t('view_DidUpgrade_CTA')}
        </button>
        <output className={styles.errorTooltip} hidden={!error}>
          {t('view_DidUpgrade_insufficientFunds', asKiltCoins(total, 'costs'))}
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

      <LinkBack />
      <Stats />
    </form>
  );
}
