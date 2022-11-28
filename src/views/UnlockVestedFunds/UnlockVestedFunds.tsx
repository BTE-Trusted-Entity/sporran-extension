import { FormEvent, useCallback } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { Link } from 'react-router-dom';

import { ConfigService } from '@kiltprotocol/config';

import BN from 'bn.js';

import * as styles from './UnlockVestedFunds.module.css';

import { Identity } from '../../utilities/identities/types';
import { paths } from '../paths';

import { TxStatusModal } from '../../components/TxStatusModal/TxStatusModal';
import { LinkBack } from '../../components/LinkBack/LinkBack';
import { Stats } from '../../components/Stats/Stats';
import {
  PasswordField,
  usePasswordField,
} from '../../components/PasswordField/PasswordField';
import { IdentitySlide } from '../../components/IdentitySlide/IdentitySlide';
import { KiltAmount } from '../../components/KiltAmount/KiltAmount';
import { useSubmitStates } from '../../utilities/useSubmitStates/useSubmitStates';
import { useAsyncValue } from '../../utilities/useAsyncValue/useAsyncValue';
import { makeFakeIdentityCrypto } from '../../utilities/makeFakeIdentityCrypto/makeFakeIdentityCrypto';

async function getFee(): Promise<BN> {
  const { keypair } = makeFakeIdentityCrypto();

  const api = ConfigService.get('api');
  const unsigned = api.tx.vesting.vest();
  return (await unsigned.paymentInfo(keypair)).partialFee;
}

interface Props {
  identity: Identity;
}

export function UnlockVestedFunds({ identity }: Props): JSX.Element {
  const t = browser.i18n.getMessage;

  const fee = useAsyncValue(getFee, []);

  const passwordField = usePasswordField();

  const { submit, modalProps, submitting, unpaidCosts } = useSubmitStates();

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      const { keypair } = await passwordField.get(event);

      const api = ConfigService.get('api');
      const unsigned = api.tx.vesting.vest();

      await submit(keypair, unsigned);
    },
    [passwordField, submit],
  );

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.container}
      autoComplete="off"
    >
      <h1 className={styles.heading}>{t('view_UnlockVestedFunds_heading')}</h1>
      <p className={styles.subline}>{t('view_UnlockVestedFunds_subline')}</p>

      <IdentitySlide identity={identity} />

      {fee && (
        <p className={styles.fee}>
          {t('view_UnlockVestedFunds_fee')}
          <KiltAmount amount={fee} type="costs" smallDecimals />
        </p>
      )}

      <p className={styles.explanation}>
        {t('view_UnlockVestedFunds_explanation')}
      </p>

      <PasswordField identity={identity} autoFocus password={passwordField} />

      <p className={styles.buttonsLine}>
        <Link to={paths.home} className={styles.cancel}>
          {t('common_action_cancel')}
        </Link>
        <button type="submit" className={styles.submit} disabled={submitting}>
          {t('view_UnlockVestedFunds_CTA')}
        </button>
        <output
          className={styles.errorTooltip}
          hidden={!unpaidCosts || Boolean(modalProps)}
        >
          {t('view_UnlockVestedFunds_insufficient_funds', [unpaidCosts])}
        </output>
      </p>

      {modalProps && <TxStatusModal {...modalProps} identity={identity} />}

      <LinkBack />
      <Stats />
    </form>
  );
}
