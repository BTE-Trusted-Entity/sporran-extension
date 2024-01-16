import type {
  BN,
  Did,
  Service,
  KiltKeyringPair,
  SignerInterface,
} from '@kiltprotocol/types';

import { FormEvent, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import browser from 'webextension-polyfill';

import { ConfigService } from '@kiltprotocol/sdk-js';
import { authorizeTx, serviceToChain } from '@kiltprotocol/did';

import * as styles from './DidEndpointsSign.module.css';

import { Identity } from '../../utilities/identities/types';
import { IdentitySlide } from '../../components/IdentitySlide/IdentitySlide';
import { LinkBack } from '../../components/LinkBack/LinkBack';
import { Stats } from '../../components/Stats/Stats';
import {
  PasswordField,
  usePasswordField,
} from '../../components/PasswordField/PasswordField';
import { TxStatusModal } from '../../components/TxStatusModal/TxStatusModal';
import { CopyValue } from '../../components/CopyValue/CopyValue';
import {
  getIdentityCryptoFromSeed,
  getIdentityDid,
} from '../../utilities/identities/identities';
import { useSubmitStates } from '../../utilities/useSubmitStates/useSubmitStates';
import { getFullDidDocument } from '../../utilities/did/did';
import { generatePath, paths } from '../paths';
import { useAsyncValue } from '../../utilities/useAsyncValue/useAsyncValue';
import {
  KiltAmount,
  asKiltCoins,
} from '../../components/KiltAmount/KiltAmount';
import { makeFakeIdentityCrypto } from '../../utilities/makeFakeIdentityCrypto/makeFakeIdentityCrypto';
import { getDepositServiceEndpoint } from '../../utilities/getDeposit/getDeposit';
import { useAddressBalance } from '../../components/Balance/Balance';

export type ActionType = 'add' | 'remove';

async function getDidAuthorizedExtrinsic(
  keypair: KiltKeyringPair,
  signers: SignerInterface[],
  did: Did,
  service: Service,
  type: ActionType,
) {
  const document = await getFullDidDocument(did);

  const api = ConfigService.get('api');
  const chainService = serviceToChain(service);
  const draft =
    type === 'add'
      ? api.tx.did.addServiceEndpoint(chainService)
      : api.tx.did.removeServiceEndpoint(chainService.id);

  return authorizeTx(document.id, draft, signers, keypair.address);
}

async function getFee(did: Did, service: Service, type: ActionType) {
  const { keypair, signers } = await makeFakeIdentityCrypto();

  const authorized = await getDidAuthorizedExtrinsic(
    keypair,
    signers,
    did,
    service,
    type,
  );

  const { partialFee } = await authorized.paymentInfo(keypair);

  return partialFee;
}

export function useCosts(
  address: string,
  did: Did,
  type: ActionType,
  service: Service,
): {
  fee?: BN;
  deposit?: BN;
  total?: BN;
  insufficientKilt: boolean;
} {
  const fee = useAsyncValue(getFee, [did, service, type]);
  const deposit = getDepositServiceEndpoint(type);

  const total = useMemo(
    () => (fee && deposit ? fee.add(deposit.amount) : undefined),
    [deposit, fee],
  );

  const balance = useAddressBalance(address);
  const insufficientKilt = Boolean(
    total && balance && balance.transferable.lt(total),
  );

  return { total, insufficientKilt };
}

interface Props {
  identity: Identity;
  type: ActionType;
  endpoint: Service;
}

export function DidEndpointsSign({ identity, type, endpoint }: Props) {
  const t = browser.i18n.getMessage;
  const { address } = identity;
  const did = getIdentityDid(identity);

  const passwordField = usePasswordField();

  const { total, insufficientKilt } = useCosts(address, did, type, endpoint);

  const { submit, modalProps, submitting } = useSubmitStates();

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      const { keypair, seed } = await passwordField.get(event);
      const { signers } = await getIdentityCryptoFromSeed(seed);

      const authorized = await getDidAuthorizedExtrinsic(
        keypair,
        signers,
        did,
        endpoint,
        type,
      );

      await submit(keypair, authorized);
    },
    [passwordField, type, endpoint, did, submit],
  );

  const modalMessagesAdd = {
    pending: t('view_DidEndpointsSign_add_pending'),
    success: t('view_DidEndpointsSign_add_success'),
    error: t('view_DidEndpointsSign_add_error'),
  };
  const modalMessagesRemove = {
    pending: t('view_DidEndpointsSign_remove_pending'),
    success: t('view_DidEndpointsSign_remove_success'),
    error: t('view_DidEndpointsSign_remove_error'),
  };

  if (!total) {
    return null; // blockchain data pending
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.container}
      autoComplete="off"
    >
      <h1 className={styles.heading}>
        {type === 'add'
          ? t('view_DidEndpointsSign_heading_add')
          : t('view_DidEndpointsSign_heading_remove')}
      </h1>
      <p className={styles.subline}>{t('view_DidEndpointsSign_subline')}</p>

      <IdentitySlide identity={identity} />

      <CopyValue value={did} label="DID" className={styles.didLine} />

      {total && (
        <p className={styles.fee}>
          {t('view_DidEndpointsSign_fee')}
          <KiltAmount amount={total} type="costs" smallDecimals />
        </p>
      )}

      <dl className={styles.details}>
        <div className={styles.fullWidthDetail}>
          <dt className={styles.detailName}>
            {t('view_DidEndpointsSign_url')}
          </dt>
          <dd className={styles.detailValue}>{endpoint.serviceEndpoint[0]}</dd>
        </div>
        <div className={styles.detail}>
          <dt className={styles.detailName}>
            {t('view_DidEndpointsSign_type')}
          </dt>
          <dd className={styles.detailValue}>{endpoint.type[0]}</dd>
        </div>
        <div className={styles.detail}>
          <dt className={styles.detailName}>{t('view_DidEndpointsSign_id')}</dt>
          <dd className={styles.detailValue}>{serviceToChain(endpoint).id}</dd>
        </div>
      </dl>

      <PasswordField identity={identity} autoFocus password={passwordField} />

      <p className={styles.buttonsLine}>
        <Link to={paths.home} className={styles.cancel}>
          {t('common_action_cancel')}
        </Link>
        <button
          type="submit"
          className={styles.submit}
          disabled={insufficientKilt || submitting}
        >
          {t('common_action_sign')}
        </button>
        <output
          className={styles.errorTooltip}
          hidden={!insufficientKilt || Boolean(modalProps)}
        >
          {insufficientKilt &&
            t('view_DidEndpointsSign_insufficientFunds', [
              asKiltCoins(total, 'costs'),
            ])}
        </output>
      </p>

      {modalProps && (
        <TxStatusModal
          {...modalProps}
          identity={identity}
          messages={type === 'add' ? modalMessagesAdd : modalMessagesRemove}
          destination={generatePath(paths.identity.did.manage.endpoints.start, {
            address,
          })}
        />
      )}

      <LinkBack />
      <Stats />
    </form>
  );
}
