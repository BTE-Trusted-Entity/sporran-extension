import { useCallback } from 'react';
import { Link, generatePath } from 'react-router-dom';
import { browser } from 'webextension-polyfill-ts';
import { Deposit } from '@kiltprotocol/types';

import { FullDidDetails, Web3Names } from '@kiltprotocol/did';

import { BlockchainApiConnection } from '@kiltprotocol/chain-helpers';

import { Option, Struct, u64 } from '@polkadot/types';

import { AccountId } from '@polkadot/types/interfaces';

import * as styles from './W3NRemove.module.css';

import { Identity } from '../../utilities/identities/types';

import {
  getKeypairBySeed,
  getKeystoreFromSeed,
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

import { getFullDidDetails } from '../../utilities/did/did';

import { useSwrDataOrThrow } from '../../utilities/useSwrDataOrThrow/useSwrDataOrThrow';

import { useSubmitStates } from '../../utilities/useSubmitStates/useSubmitStates';

async function getFee(fullDid?: FullDidDetails) {
  if (!fullDid) {
    return undefined;
  }

  const fakeSeed = new Uint8Array(32);
  const keypair = getKeypairBySeed(fakeSeed);

  const extrinsic = await Web3Names.getReleaseByOwnerTx();

  const authorized = await fullDid.authorizeExtrinsic(
    extrinsic,
    await getKeystoreFromSeed(fakeSeed),
    keypair.address,
  );

  return (await authorized.paymentInfo(keypair)).partialFee;
}

interface Web3NameData extends Struct {
  owner: AccountId;
  claimedAt: u64;
  deposit: Deposit;
}

async function getDepositData(did: string) {
  const web3name = await Web3Names.queryWeb3NameForDid(did);

  const { api } = await BlockchainApiConnection.getConnectionOrConnect();

  const { deposit } = (
    await api.query.web3Names.owner<Option<Web3NameData>>(web3name)
  ).unwrap();

  const { owner, amount } = deposit;

  return { owner: owner.toString(), amount };
}

interface Props {
  identity: Identity;
}

export function W3NRemove({ identity }: Props): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const { address, did } = identity;
  const destination = generatePath(paths.identity.did.manage.start, {
    address,
  });

  const deposit = useSwrDataOrThrow(
    did,
    getDepositData,
    'Web3NameRemove.getDepositData',
  );

  const isDepositOwner = deposit?.owner === address;

  const fullDidDetails = useSwrDataOrThrow(
    did,
    getFullDidDetails,
    'getFullDidDetails',
  );

  const fee = useSwrDataOrThrow(
    fullDidDetails,
    getFee,
    'Web3NameRemove.getFee',
  );

  const { submit, modalProps, submitting, unpaidCosts } = useSubmitStates();

  const passwordField = usePasswordField();
  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      if (!fullDidDetails) {
        return;
      }

      const { keypair, seed } = await passwordField.get(event);

      const extrinsic = await Web3Names.getReleaseByOwnerTx();
      const authorized = await fullDidDetails.authorizeExtrinsic(
        extrinsic,
        await getKeystoreFromSeed(seed),
        keypair.address,
      );
      await submit(keypair, authorized);
    },
    [passwordField, fullDidDetails, submit],
  );

  if (!fee || !deposit || !fullDidDetails) {
    return null; // blockchain data pending
  }

  const total = deposit.amount.sub(fee);

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.container}
      autoComplete="off"
    >
      <h1 className={styles.heading}>{t('view_W3NRemove_heading')}</h1>
      <p className={styles.subline}>{t('view_W3NRemove_subline')}</p>

      <IdentitySlide identity={identity} options={false} />

      {isDepositOwner && (
        <p className={styles.costs}>
          {t('view_W3NRemove_total')}
          <KiltAmount amount={total} type="costs" smallDecimals />
        </p>
      )}
      {isDepositOwner && (
        <p className={styles.details}>
          {t('view_W3NRemove_deposit')}
          {asKiltCoins(deposit.amount, 'costs')} <KiltCurrency />
          {t('view_W3NRemove_fee')}
          {asKiltCoins(fee, 'costs')} <KiltCurrency />
        </p>
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
