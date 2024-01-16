import type { DidDocument } from '@kiltprotocol/types';

import { FormEvent, Fragment, useCallback } from 'react';
import { generatePath, Link } from 'react-router-dom';
import browser from 'webextension-polyfill';

import { ConfigService } from '@kiltprotocol/sdk-js';
import { authorizeTx } from '@kiltprotocol/did';

import * as styles from './W3NRemove.module.css';

import { Identity } from '../../utilities/identities/types';

import {
  getIdentityCryptoFromSeed,
  getIdentityDid,
} from '../../utilities/identities/identities';
import { paths } from '../paths';

import { IdentitySlide } from '../../components/IdentitySlide/IdentitySlide';
import {
  PasswordField,
  usePasswordField,
} from '../../components/PasswordField/PasswordField';
import { KiltCurrency } from '../../components/KiltCurrency/KiltCurrency';
import {
  asKiltCoins,
  KiltAmount,
} from '../../components/KiltAmount/KiltAmount';
import { TxStatusModal } from '../../components/TxStatusModal/TxStatusModal';
import { LinkBack } from '../../components/LinkBack/LinkBack';
import { Stats } from '../../components/Stats/Stats';
import { useFullDidDocument } from '../../utilities/did/did';
import { useAsyncValue } from '../../utilities/useAsyncValue/useAsyncValue';
import { useDepositWeb3Name } from '../../utilities/getDeposit/getDeposit';
import { useSubmitStates } from '../../utilities/useSubmitStates/useSubmitStates';
import { makeFakeIdentityCrypto } from '../../utilities/makeFakeIdentityCrypto/makeFakeIdentityCrypto';

async function getFee(fullDid?: DidDocument) {
  if (!fullDid) {
    return undefined;
  }

  const { address, keypair, signers } = await makeFakeIdentityCrypto();

  const api = ConfigService.get('api');

  const authorized = await authorizeTx(
    fullDid.id,
    api.tx.web3Names.releaseByOwner(),
    signers,
    address,
  );

  return (await authorized.paymentInfo(keypair)).partialFee;
}

interface Props {
  identity: Identity;
}

export function W3NRemove({ identity }: Props) {
  const t = browser.i18n.getMessage;

  const { address } = identity;
  const did = getIdentityDid(identity);

  const destination = generatePath(paths.identity.did.manage.start, {
    address,
  });

  const deposit = useDepositWeb3Name(did);

  const isDepositOwner = deposit?.owner === address;

  const fullDidDocument = useFullDidDocument(did);
  const fee = useAsyncValue(getFee, [fullDidDocument]);

  const { submit, modalProps, submitting, unpaidCosts } = useSubmitStates();

  const passwordField = usePasswordField();
  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      if (!fullDidDocument) {
        return;
      }

      const { keypair, seed } = await passwordField.get(event);
      const { signers } = await getIdentityCryptoFromSeed(seed);

      const api = ConfigService.get('api');

      const authorized = await authorizeTx(
        fullDidDocument.id,
        api.tx.web3Names.releaseByOwner(),
        signers,
        keypair.address,
      );
      await submit(keypair, authorized);
    },
    [passwordField, fullDidDocument, submit],
  );

  if (!fee || !fullDidDocument) {
    return null; // blockchain data pending
  }

  const total = deposit?.amount.sub(fee);

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.container}
      autoComplete="off"
    >
      <h1 className={styles.heading}>{t('view_W3NRemove_heading')}</h1>
      <p className={styles.subline}>{t('view_W3NRemove_subline')}</p>

      <IdentitySlide identity={identity} options={false} />

      {!isDepositOwner && (
        <p className={styles.costs}>
          {t('view_W3NRemove_fee_as_total')}
          <KiltAmount amount={fee} type="costs" smallDecimals />
        </p>
      )}

      {isDepositOwner && total && (
        <Fragment>
          <p className={styles.costs}>
            {t('view_W3NRemove_total')}
            <KiltAmount amount={total} type="costs" smallDecimals />
          </p>

          <p className={styles.details}>
            {t('view_W3NRemove_deposit')}
            {asKiltCoins(deposit?.amount, 'funds')} <KiltCurrency />
            {t('view_W3NRemove_fee')}
            {asKiltCoins(fee, 'costs')} <KiltCurrency />
          </p>
        </Fragment>
      )}

      <p className={styles.explanation}>{t('view_W3NRemove_explanation')}</p>

      <PasswordField identity={identity} autoFocus password={passwordField} />

      <p className={styles.buttonsLine}>
        <Link to={paths.home} className={styles.cancel}>
          {t('common_action_cancel')}
        </Link>
        <button type="submit" className={styles.submit} disabled={submitting}>
          {t('common_action_sign')}
        </button>
        <output
          className={styles.errorTooltip}
          hidden={!unpaidCosts || Boolean(modalProps)}
        >
          {t('view_W3NRemove_insufficientFunds', [asKiltCoins(fee, 'costs')])}
        </output>
      </p>

      {modalProps && (
        <TxStatusModal
          {...modalProps}
          identity={identity}
          destination={destination}
          messages={{
            pending: t('view_W3NRemove_pending'),
            success: t('view_W3NRemove_success'),
            error: t('view_W3NRemove_error'),
          }}
        />
      )}

      <LinkBack />
      <Stats />
    </form>
  );
}
