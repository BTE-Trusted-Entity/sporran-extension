import { FormEvent, JSX, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import BN from 'bn.js';
import { browser } from 'webextension-polyfill-ts';

import { DidUri } from '@kiltprotocol/sdk-js';

import * as styles from './DidRepair.module.css';

import { useAsyncValue } from '../../utilities/useAsyncValue/useAsyncValue';
import { Identity } from '../../utilities/identities/types';
import { getIdentityDid } from '../../utilities/identities/identities';
import {
  PasswordError,
  PasswordField,
  usePasswordField,
} from '../../components/PasswordField/PasswordField';
import { getFee, sign, submit } from '../../utilities/didRepair/didRepair';
import { IdentitySlide } from '../../components/IdentitySlide/IdentitySlide';
import { useAddressBalance } from '../../components/Balance/Balance';
import { KiltCurrency } from '../../components/KiltCurrency/KiltCurrency';
import { asKiltCoins } from '../../components/KiltAmount/KiltAmount';
import { TxStatusModal } from '../../components/TxStatusModal/TxStatusModal';
import { LinkBack } from '../../components/LinkBack/LinkBack';
import { Stats } from '../../components/Stats/Stats';
import { paths } from '../paths';

interface Props {
  identity: Identity;
}

function useCosts(
  address: string,
  did: DidUri,
): {
  fee?: BN;
  error: boolean;
} {
  const fee = useAsyncValue(getFee, [did]);

  const balance = useAddressBalance(address);
  const error = Boolean(balance && fee && balance.transferable.lt(fee));

  return { fee, error };
}

export function DidRepair({ identity }: Props): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const { address } = identity;
  const did = getIdentityDid(identity);

  const { fee, error } = useCosts(address, did);
  const [txHash, setTxHash] = useState<string>();

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'pending' | 'success' | 'error' | null>(
    null,
  );

  const passwordField = usePasswordField();

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      try {
        const { seed } = await passwordField.get(event);

        setSubmitting(true);
        setStatus('pending');

        const hash = await sign(did, seed);
        setTxHash(hash);

        await submit(hash);

        setStatus('success');
      } catch (error) {
        if (error instanceof PasswordError) {
          return;
        }
        setSubmitting(false);
        setStatus('error');
      }
    },
    [did, passwordField],
  );

  const closeModal = useCallback(() => {
    setStatus(null);
  }, []);

  if (!fee) {
    return null; // blockchain data pending
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.container}
      autoComplete="off"
    >
      <h1 className={styles.heading}>{t('view_DidRepair_heading')}</h1>
      <p className={styles.subline}>{t('view_DidRepair_subline')}</p>

      <IdentitySlide identity={identity} />

      <p className={styles.fee}>
        {t('view_DidRepair_fee')}
        {asKiltCoins(fee, 'costs')} <KiltCurrency />
      </p>

      <p className={styles.info}>{t('view_DidRepair_info')}</p>

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
          {t('view_DidRepair_insufficientFunds', [asKiltCoins(fee, 'costs')])}
        </output>
      </p>

      {status && (
        <TxStatusModal
          identity={identity}
          status={status}
          txHash={txHash}
          onDismissError={closeModal}
          messages={{
            pending: t('view_DidRepair_pending'),
            success: t('view_DidRepair_success'),
            error: t('view_DidRepair_error'),
          }}
        />
      )}

      <LinkBack />
      <Stats />
    </form>
  );
}
