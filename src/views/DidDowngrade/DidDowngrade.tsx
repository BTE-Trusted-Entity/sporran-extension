import type { Did } from '@kiltprotocol/types';

import { FormEvent, Fragment, useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import BN from 'bn.js';
import browser from 'webextension-polyfill';

import * as styles from './DidDowngrade.module.css';

import { Identity } from '../../utilities/identities/types';
import {
  getFee,
  sign,
  submit,
} from '../../utilities/didDowngrade/didDowngrade';
import { saveIdentity } from '../../utilities/identities/identities';
import { paths } from '../paths';

import { IdentitySlide } from '../../components/IdentitySlide/IdentitySlide';
import {
  PasswordError,
  PasswordField,
  usePasswordField,
} from '../../components/PasswordField/PasswordField';
import { useAddressBalance } from '../../components/Balance/Balance';
import { KiltCurrency } from '../../components/KiltCurrency/KiltCurrency';
import {
  asKiltCoins,
  KiltAmount,
} from '../../components/KiltAmount/KiltAmount';
import { TxStatusModal } from '../../components/TxStatusModal/TxStatusModal';
import { LinkBack } from '../../components/LinkBack/LinkBack';
import { Stats } from '../../components/Stats/Stats';
import {
  invalidateCredentials,
  useIdentityCredentials,
} from '../../utilities/credentials/credentials';
import {
  useDepositDid,
  useDepositWeb3Name,
} from '../../utilities/getDeposit/getDeposit';
import { useAsyncValue } from '../../utilities/useAsyncValue/useAsyncValue';

function useCosts(
  address: string,
  did: Did | undefined, // after the downgrade it’s set to undefined
): {
  fee?: BN;
  deposit?: BN;
  total?: BN;
  error: boolean;
} {
  const fee = useAsyncValue(getFee, [did]);
  const depositDid = useDepositDid(did);
  const depositWeb3Name = useDepositWeb3Name(did);

  const deposit = useMemo(() => {
    const didAmount =
      depositDid?.owner === address ? depositDid.amount : new BN(0);
    const w3nAmount =
      depositWeb3Name?.owner === address ? depositWeb3Name.amount : new BN(0);
    return didAmount.add(w3nAmount);
  }, [address, depositDid, depositWeb3Name]);

  const total = useMemo(
    () => (fee && !deposit.isZero() ? deposit.sub(fee) : undefined),
    [fee, deposit],
  );

  const balance = useAddressBalance(address);
  const error = Boolean(fee && balance && balance.transferable.lt(fee));

  return { fee, deposit, total, error };
}

interface Props {
  identity: Identity;
}

export function DidDowngrade({ identity }: Props) {
  const t = browser.i18n.getMessage;

  const { address, did } = identity;
  const { fee, deposit, total, error } = useCosts(address, did);
  const [txHash, setTxHash] = useState<string>();

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'pending' | 'success' | 'error' | null>(
    null,
  );

  const sporranCredentials = useIdentityCredentials(did);

  const passwordField = usePasswordField();
  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      try {
        const { seed } = await passwordField.get(event);

        setSubmitting(true);
        setStatus('pending');

        const hash = await sign(identity, seed);
        setTxHash(hash);

        await submit(hash);
        await saveIdentity({
          ...identity,
          did: undefined,
          deletedDid: identity.did,
        });

        if (sporranCredentials) {
          await invalidateCredentials(sporranCredentials);
        }

        setStatus('success');
      } catch (error) {
        if (error instanceof PasswordError) {
          return;
        }
        console.error(error);
        setSubmitting(false);
        setStatus('error');
      }
    },
    [identity, passwordField, sporranCredentials],
  );

  const closeModal = useCallback(() => {
    setStatus(null);
  }, []);

  if (!fee) {
    return null; // blockchain data pending
  }

  if (!sporranCredentials) {
    return null; // storage data pending
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.container}
      autoComplete="off"
    >
      <h1 className={styles.heading}>{t('view_DidDowngrade_heading')}</h1>
      <p className={styles.subline}>{t('view_DidDowngrade_subline')}</p>

      <IdentitySlide identity={identity} options={false} />

      {total && deposit && (
        <Fragment>
          <p className={styles.costs}>
            {t('view_DidDowngrade_total')}
            <KiltAmount amount={total} type="costs" smallDecimals />
          </p>
          <p className={styles.details}>
            {t('view_DidDowngrade_deposit')}
            {asKiltCoins(deposit, 'funds')} <KiltCurrency />
            {t('view_DidDowngrade_fee')}
            {asKiltCoins(fee, 'costs')} <KiltCurrency />
          </p>
        </Fragment>
      )}

      {!total && (
        <p className={styles.costs}>
          {t('view_DidDowngrade_fee_as_total')}
          <KiltAmount amount={fee} type="costs" smallDecimals />
        </p>
      )}

      <p className={styles.explanation}>{t('view_DidDowngrade_explanation')}</p>

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
          {t('view_DidDowngrade_insufficientFunds', [
            asKiltCoins(fee, 'costs'),
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
            pending: t('view_DidDowngrade_pending'),
            success: t('view_DidDowngrade_success'),
            error: t('view_DidDowngrade_error'),
          }}
        />
      )}

      <LinkBack />
      <Stats />
    </form>
  );
}
