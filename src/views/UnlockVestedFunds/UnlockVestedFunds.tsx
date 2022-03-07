import { useState, useCallback } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { Link } from 'react-router-dom';

import * as styles from './UnlockVestedFunds.module.css';

import { Identity } from '../../utilities/identities/types';
import { paths } from '../paths';

import {
  insufficientFunds,
  signVest,
  submitVest,
} from '../../utilities/vesting/vesting';

import { Avatar } from '../../components/Avatar/Avatar';
import { TxStatusModal } from '../../components/TxStatusModal/TxStatusModal';
import { LinkBack } from '../../components/LinkBack/LinkBack';
import { Stats } from '../../components/Stats/Stats';
import {
  PasswordField,
  usePasswordField,
} from '../../components/PasswordField/PasswordField';

interface Props {
  identity: Identity;
}

export function UnlockVestedFunds({ identity }: Props): JSX.Element {
  const t = browser.i18n.getMessage;

  const [txStatus, setTxStatus] = useState<
    'pending' | 'success' | 'error' | null
  >(null);

  const [txHash, setTxHash] = useState<string>();

  const [error, setError] = useState<string | null>(null);

  const passwordField = usePasswordField();

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      try {
        const { keypair } = await passwordField.get(event);

        setTxStatus('pending');

        const hash = await signVest(keypair);
        setTxHash(hash);

        await submitVest(hash);

        setTxStatus('success');
      } catch (error) {
        setTxStatus('error');
        console.error(error);
        if (error instanceof Error && error.message === insufficientFunds) {
          setError(t('view_UnlockVestedFunds_insufficient_funds'));
        }
      }
    },
    [t, passwordField],
  );

  const closeModal = useCallback(() => {
    setTxStatus(null);
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.container}
      autoComplete="off"
    >
      <h1 className={styles.heading}>{t('view_UnlockVestedFunds_heading')}</h1>
      <p className={styles.subline}>{t('view_UnlockVestedFunds_subline')}</p>

      <Avatar identity={identity} className={styles.avatar} />
      <p className={styles.name}>{identity.name}</p>

      <p className={styles.explanation}>
        {t('view_UnlockVestedFunds_explanation')}
      </p>

      <PasswordField identity={identity} autoFocus password={passwordField} />

      <p className={styles.buttonsLine}>
        <Link to={paths.home} className={styles.cancel}>
          {t('common_action_cancel')}
        </Link>
        <button type="submit" className={styles.submit}>
          {t('view_UnlockVestedFunds_CTA')}
        </button>
        <output
          className={styles.errorTooltip}
          hidden={!error || Boolean(txStatus)}
        >
          {error}
        </output>
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
