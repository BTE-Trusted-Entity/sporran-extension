import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import BN from 'bn.js';
import { browser } from 'webextension-polyfill-ts';
import { IDidDetails } from '@kiltprotocol/types';

import * as styles from './DidDowngrade.module.css';

import { Identity } from '../../utilities/identities/types';
import {
  getDeposit,
  getFee,
  sign,
  submit,
} from '../../utilities/didDowngrade/didDowngrade';
import { saveIdentity } from '../../utilities/identities/identities';
import { paths } from '../paths';

import { IdentitySlide } from '../../components/IdentitySlide/IdentitySlide';
import {
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
  useIdentityCredentials,
  invalidateCredentials,
} from '../../utilities/credentials/credentials';

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
  const [fee, setFee] = useState<BN | undefined>();
  const [deposit, setDeposit] = useState<BN | undefined>();

  useEffect(() => {
    (async () => {
      setFee(await getFee(did));
      setDeposit(await getDeposit());
    })();
  }, [did]);

  const total = useMemo(
    () => (fee && deposit ? deposit.sub(fee) : undefined),
    [deposit, fee],
  );

  const balance = useAddressBalance(address);
  const error = Boolean(fee && balance && balance.transferable.lt(fee));

  return { fee, deposit, total, error };
}

export function DidDowngrade({ identity }: Props): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const { address, did } = identity;
  const { fee, deposit, total, error } = useCosts(address, did);
  const [txHash, setTxHash] = useState<string>();

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'pending' | 'success' | 'error' | null>(
    null,
  );

  const credentials = useIdentityCredentials(did);

  const passwordField = usePasswordField();
  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      try {
        const { keypair } = await passwordField.get(event);

        setSubmitting(true);
        setStatus('pending');

        const hash = await sign(identity, keypair);
        setTxHash(hash);

        const did = await submit(hash);

        await saveIdentity({ ...identity, did });

        if (credentials) {
          await invalidateCredentials(credentials);
        }

        setStatus('success');
      } catch (error) {
        setSubmitting(false);
        setStatus('error');
      }
    },
    [identity, passwordField, credentials],
  );

  const closeModal = useCallback(() => {
    setStatus(null);
  }, []);

  if (!(fee && deposit && total)) {
    return null; // blockchain data pending
  }

  if (!credentials) {
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

      <p className={styles.costs}>
        {t('view_DidDowngrade_total')}
        <KiltAmount amount={total} type="costs" smallDecimals />
      </p>
      <p className={styles.details}>
        {t('view_DidDowngrade_deposit')}
        {asKiltCoins(deposit, 'costs')} <KiltCurrency />
        {t('view_DidDowngrade_fee')}
        {asKiltCoins(fee, 'costs')} <KiltCurrency />
      </p>

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
        <output className={styles.errorTooltip} hidden={!error}>
          {t('view_DidDowngrade_insufficientFunds', asKiltCoins(fee, 'costs'))}
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
