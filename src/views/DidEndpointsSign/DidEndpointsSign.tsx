import { FormEvent, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { browser } from 'webextension-polyfill-ts';
import { DidServiceEndpoint, DidUri } from '@kiltprotocol/types';
import { Chain } from '@kiltprotocol/did';

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
  getKeypairBySeed,
  getKeystoreFromSeed,
} from '../../utilities/identities/identities';
import { useSubmitStates } from '../../utilities/useSubmitStates/useSubmitStates';
import { getFullDidDetails } from '../../utilities/did/did';
import { generatePath, paths } from '../paths';
import { useAsyncValue } from '../../utilities/useAsyncValue/useAsyncValue';
import { KiltAmount } from '../../components/KiltAmount/KiltAmount';

type ActionType = 'add' | 'remove';

async function getDidAuthorizedExtrinsic(
  seed: Uint8Array,
  did: DidUri,
  endpoint: DidServiceEndpoint,
  type: ActionType,
) {
  const keystore = await getKeystoreFromSeed(seed);
  const keypair = getKeypairBySeed(seed);
  const fullDidDetails = await getFullDidDetails(did);

  // getRemoveEndpointExtrinsic expects just the fragment part
  const draft =
    type === 'add'
      ? await Chain.getAddEndpointExtrinsic(endpoint)
      : await Chain.getRemoveEndpointExtrinsic(endpoint.id);

  return await fullDidDetails.authorizeExtrinsic(
    draft,
    keystore,
    keypair.address,
  );
}

async function getFee(
  did: DidUri,
  endpoint: DidServiceEndpoint,
  type: ActionType,
) {
  const fakeSeed = new Uint8Array(32);
  const keypair = getKeypairBySeed(fakeSeed);

  const authorized = await getDidAuthorizedExtrinsic(
    fakeSeed,
    did,
    endpoint,
    type,
  );

  return (await authorized.paymentInfo(keypair)).partialFee;
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
  const { address, did } = identity;

  const fee = useAsyncValue(getFee, [did, endpoint, type]);

  const passwordField = usePasswordField();
  const { submit, modalProps, submitting, unpaidCosts } = useSubmitStates();

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      const { keypair, seed } = await passwordField.get(event);

      const authorized = await getDidAuthorizedExtrinsic(
        seed,
        did,
        endpoint,
        type,
      );

      await submit(keypair, authorized);
    },
    [endpoint, did, passwordField, submit, type],
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

      <CopyValue value={identity.did} label="DID" className={styles.didLine} />

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
          <dd className={styles.detailValue}>{endpoint.urls[0]}</dd>
        </div>
        <div className={styles.detail}>
          <dt className={styles.detailName}>
            {t('view_DidEndpointsSign_type')}
          </dt>
          <dd className={styles.detailValue}>{endpoint.types[0]}</dd>
        </div>
        <div className={styles.detail}>
          <dt className={styles.detailName}>{t('view_DidEndpointsSign_id')}</dt>
          <dd className={styles.detailValue}>{endpoint.id}</dd>
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
          {t('view_DidEndpointsSign_insufficientFunds', [unpaidCosts])}
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
