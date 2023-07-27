import { FormEvent, JSX, useCallback } from 'react';
import { Link } from 'react-router-dom';
import browser from 'webextension-polyfill';
import {
  ConfigService,
  Did,
  DidServiceEndpoint,
  DidUri,
  KiltKeyringPair,
  SignExtrinsicCallback,
} from '@kiltprotocol/sdk-js';

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
import { KiltAmount } from '../../components/KiltAmount/KiltAmount';
import { makeFakeIdentityCrypto } from '../../utilities/makeFakeIdentityCrypto/makeFakeIdentityCrypto';

type ActionType = 'add' | 'remove';

async function getDidAuthorizedExtrinsic(
  keypair: KiltKeyringPair,
  sign: SignExtrinsicCallback,
  did: DidUri,
  service: DidServiceEndpoint,
  type: ActionType,
) {
  const document = await getFullDidDocument(did);

  const api = ConfigService.get('api');
  const draft =
    type === 'add'
      ? api.tx.did.addServiceEndpoint(Did.serviceToChain(service))
      : api.tx.did.removeServiceEndpoint(Did.resourceIdToChain(service.id));

  return Did.authorizeTx(document.uri, draft, sign, keypair.address);
}

async function getFee(
  did: DidUri,
  service: DidServiceEndpoint,
  type: ActionType,
) {
  const { keypair, sign } = makeFakeIdentityCrypto();

  const authorized = await getDidAuthorizedExtrinsic(
    keypair,
    sign,
    did,
    service,
    type,
  );

  const { partialFee } = await authorized.paymentInfo(keypair);

  const api = ConfigService.get('api');
  if (type !== 'add' || !('serviceEndpointDeposit' in api.consts.did)) {
    return partialFee;
  }

  const deposit = api.consts.did.serviceEndpointDeposit as typeof partialFee;
  return partialFee.add(deposit);
}

interface Props {
  identity: Identity;
  type: ActionType;
  endpoint: DidServiceEndpoint;
}

export function DidEndpointsSign({
  identity,
  type,
  endpoint,
}: Props): JSX.Element {
  const t = browser.i18n.getMessage;
  const { address } = identity;
  const did = getIdentityDid(identity);

  const fee = useAsyncValue(getFee, [did, endpoint, type]);

  const passwordField = usePasswordField();
  const { submit, modalProps, submitting, unpaidCosts } = useSubmitStates();

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      const { keypair, seed } = await passwordField.get(event);
      const { sign } = await getIdentityCryptoFromSeed(seed);

      const authorized = await getDidAuthorizedExtrinsic(
        keypair,
        sign,
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

      {fee && (
        <p className={styles.fee}>
          {t('view_DidEndpointsSign_fee')}
          <KiltAmount amount={fee} type="costs" smallDecimals />
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
          <dd className={styles.detailValue}>
            {Did.resourceIdToChain(endpoint.id)}
          </dd>
        </div>
      </dl>

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
          {unpaidCosts &&
            t('view_DidEndpointsSign_insufficientFunds', [unpaidCosts])}
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
