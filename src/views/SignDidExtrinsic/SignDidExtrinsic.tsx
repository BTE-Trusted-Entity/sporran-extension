import type { DidUrl, Service } from '@kiltprotocol/types';

import { FormEvent, Fragment, PropsWithChildren, useCallback } from 'react';
import browser from 'webextension-polyfill';
import { GenericExtrinsic } from '@polkadot/types';

import { ConfigService } from '@kiltprotocol/sdk-js';
import {
  authorizeBatch,
  authorizeTx,
  getVerificationRelationshipForTx,
  publicKeyToChain,
  serviceToChain,
} from '@kiltprotocol/did';

import { Signers } from '@kiltprotocol/utils';

import * as styles from './SignDidExtrinsic.module.css';

import { Identity } from '../../utilities/identities/types';
import { usePopupData } from '../../utilities/popups/usePopupData';
import {
  deriveAttestationKeyFromSeed,
  getIdentityCryptoFromSeed,
} from '../../utilities/identities/identities';
import {
  getFullDidDocument,
  isFullDid,
  verificationMethodFromKeypair,
} from '../../utilities/did/did';
import { IdentitiesCarousel } from '../../components/IdentitiesCarousel/IdentitiesCarousel';
import { IdentitySlide } from '../../components/IdentitySlide/IdentitySlide';
import {
  PasswordField,
  usePasswordField,
} from '../../components/PasswordField/PasswordField';
import { backgroundSignDidExtrinsicChannel } from '../../channels/SignDidExtrinsicChannels/backgroundSignDidExtrinsicChannel';
import { SignDidExtrinsicOriginInput } from '../../channels/SignDidExtrinsicChannels/types';

import { CopyValue } from '../../components/CopyValue/CopyValue';
import { useBooleanState } from '../../utilities/useBooleanState/useBooleanState';

import { useAsyncValue } from '../../utilities/useAsyncValue/useAsyncValue';

import {
  getAddServiceEndpoint,
  getExtrinsic,
  getExtrinsicValues,
  getRemoveServiceEndpoint,
} from './didExtrinsic';

function Endpoint({ endpoint }: { endpoint: Service }) {
  const t = browser.i18n.getMessage;

  return (
    <dl className={styles.endpointDetails}>
      {endpoint.serviceEndpoint && endpoint.serviceEndpoint.length > 0 && (
        <div className={styles.fullWidthDetail}>
          <dt className={styles.endpointName}>
            {t('view_SignDidExtrinsic_endpoint_url')}
          </dt>
          <dd className={styles.endpointValue}>
            {endpoint.serviceEndpoint[0]}
          </dd>
        </div>
      )}

      {endpoint.type && endpoint.type.length > 0 && (
        <div className={styles.endpointDetail}>
          <dt className={styles.endpointName}>
            {t('view_SignDidExtrinsic_endpoint_type')}
          </dt>
          <dd className={styles.endpointValue}>{endpoint.type[0]}</dd>
        </div>
      )}

      <div className={styles.endpointDetail}>
        <dt className={styles.endpointName}>
          {t('view_SignDidExtrinsic_endpoint_id')}
        </dt>
        <dd className={styles.endpointValue}>{serviceToChain(endpoint).id}</dd>
      </div>
    </dl>
  );
}

function AddServiceEndpointExtrinsic({
  identity,
  extrinsic,
  children,
}: PropsWithChildren<{
  identity: Identity;
  extrinsic: GenericExtrinsic;
}>) {
  const t = browser.i18n.getMessage;

  const { did } = identity;

  const endpoint = getAddServiceEndpoint(extrinsic);

  return (
    <Fragment>
      <h1 className={styles.heading}>
        {t('view_SignDidExtrinsic_endpoint_title_add')}
      </h1>
      <p className={styles.subline}>
        {t('view_SignDidExtrinsic_endpoint_subline')}
      </p>

      {children}

      {did && isFullDid(did) && (
        <CopyValue value={did} label="DID" className={styles.didLine} />
      )}

      <Endpoint endpoint={endpoint} />
    </Fragment>
  );
}

function RemoveServiceEndpointExtrinsic({
  identity,
  extrinsic,
  error,
  children,
}: PropsWithChildren<{
  identity: Identity;
  extrinsic: GenericExtrinsic;
  error: ReturnType<typeof useBooleanState>;
}>) {
  const t = browser.i18n.getMessage;

  const { did } = identity;

  const endpoint = useAsyncValue(getRemoveServiceEndpoint, [
    extrinsic,
    did,
    error,
  ]);

  return (
    <Fragment>
      <h1 className={styles.heading}>
        {t('view_SignDidExtrinsic_endpoint_title_remove')}
      </h1>
      <p className={styles.subline}>
        {t('view_SignDidExtrinsic_endpoint_subline')}
      </p>

      {children}

      {did && isFullDid(did) && (
        <CopyValue value={did} label="DID" className={styles.didLine} />
      )}

      {endpoint && <Endpoint endpoint={endpoint} />}
    </Fragment>
  );
}

function DidExtrinsic({
  children,
  extrinsic,
  origin,
}: PropsWithChildren<{
  extrinsic: GenericExtrinsic;
  origin: string;
}>) {
  const t = browser.i18n.getMessage;

  const values = getExtrinsicValues(extrinsic, origin);

  return (
    <Fragment>
      <h1 className={styles.heading}>{t('view_SignDidExtrinsic_title')}</h1>
      <p className={styles.subline}>{t('view_SignDidExtrinsic_subline')}</p>

      {children}

      <dl className={styles.details}>
        {values.map(({ label, value, details }) => (
          <Fragment key={label}>
            <dt className={styles.detailName}>{label}:</dt>
            <dd
              className={styles.detailValue}
              title={!details ? String(value) : undefined}
            >
              {!details ? (
                value
              ) : (
                <details className={styles.expanded}>
                  <summary>{value}</summary>
                  {details}
                </details>
              )}
            </dd>
          </Fragment>
        ))}
      </dl>
    </Fragment>
  );
}

interface Props {
  identity: Identity;
}

export function SignDidExtrinsic({ identity }: Props) {
  const t = browser.i18n.getMessage;

  const { did } = identity;

  const data = usePopupData<SignDidExtrinsicOriginInput>();

  const { submitter, origin, didUri } = data;

  const extrinsic = useAsyncValue(getExtrinsic, [data]);

  const removeEndpointError = useBooleanState();

  const extrinsicMethod = extrinsic?.method.method;

  const isServiceEndpointExtrinsic =
    extrinsicMethod === 'addServiceEndpoint' ||
    extrinsicMethod === 'removeServiceEndpoint';

  const isForbidden =
    extrinsic?.method.section === 'did' && !isServiceEndpointExtrinsic;

  const error = [
    !did && t('view_SignDidExtrinsic_error_unusable_did'),
    !isFullDid(did) && t('view_SignDidExtrinsic_error_light_did'),
    isForbidden && t('view_SignDidExtrinsic_error_forbidden'),
    removeEndpointError.current &&
      t('view_SignDidExtrinsic_endpoint_remove_error'),
  ].filter(Boolean)[0];

  const passwordField = usePasswordField();

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      if (!did) {
        throw new Error('DID is deleted and unusable');
      }

      if (!extrinsic) {
        throw new Error('Missing extrinsic');
      }

      if (isForbidden) {
        throw new Error('This DID call is forbidden');
      }

      const fullDidDocument = await getFullDidDocument(did);

      const { seed } = await passwordField.get(event);

      const keyRelationship = getVerificationRelationshipForTx(extrinsic);

      if (!keyRelationship) {
        throw new Error('No key relationship found');
      }

      if (keyRelationship === 'assertionMethod') {
        const api = ConfigService.get('api');
        const keypair = deriveAttestationKeyFromSeed(seed);
        const attestationKey = verificationMethodFromKeypair(keypair, did);

        fullDidDocument.verificationMethod?.push(attestationKey);
        fullDidDocument.assertionMethod = [attestationKey.id];

        const assertionMethodSigners = await Signers.getSignersForKeypair({
          keypair,
          id: `${fullDidDocument.id}${fullDidDocument.assertionMethod[0]}`,
        });

        const { signers: authSigners } = await getIdentityCryptoFromSeed(seed);

        const signers = [...assertionMethodSigners, ...authSigners];

        const authorized = await authorizeBatch({
          batchFunction: api.tx.utility.batchAll,
          did: fullDidDocument,
          extrinsics: [
            api.tx.did.setAttestationKey(publicKeyToChain(keypair)),
            extrinsic,
            api.tx.did.removeAttestationKey(),
          ],
          signers,
          submitter,
        });

        const signed = authorized.toHex();

        // Assertion key will not exist in the DID document, so we return authentication key instead
        const didKey = fullDidDocument.authentication?.[0];
        const didKeyUri = `${fullDidDocument.id}${didKey}` as DidUrl;

        await backgroundSignDidExtrinsicChannel.return({ signed, didKeyUri });

        window.close();
        return;
      }

      const didKey = fullDidDocument[keyRelationship]?.[0];
      if (!didKey) {
        throw new Error('No extrinsic signing key stored');
      }
      const didKeyUri = `${fullDidDocument.id}${didKey}` as DidUrl;

      const { signers } = await getIdentityCryptoFromSeed(seed);

      const authorized = await authorizeTx(
        fullDidDocument.id,
        extrinsic,
        signers,
        submitter,
      );
      const signed = authorized.toHex();

      await backgroundSignDidExtrinsicChannel.return({ signed, didKeyUri });

      window.close();
    },
    [extrinsic, submitter, passwordField, did, isForbidden],
  );

  const handleCancelClick = useCallback(async () => {
    await backgroundSignDidExtrinsicChannel.throw('Rejected');
    window.close();
  }, []);

  if (!extrinsic) {
    return null; // blockchain data pending
  }

  const identityIsPredetermined = did && did === didUri;
  const IdentityChoice = identityIsPredetermined
    ? IdentitySlide
    : IdentitiesCarousel;

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      {extrinsicMethod === 'addServiceEndpoint' && (
        <AddServiceEndpointExtrinsic identity={identity} extrinsic={extrinsic}>
          <IdentityChoice identity={identity} />
        </AddServiceEndpointExtrinsic>
      )}

      {extrinsicMethod === 'removeServiceEndpoint' && (
        <RemoveServiceEndpointExtrinsic
          identity={identity}
          extrinsic={extrinsic}
          error={removeEndpointError}
        >
          <IdentityChoice identity={identity} />
        </RemoveServiceEndpointExtrinsic>
      )}

      {!isServiceEndpointExtrinsic && (
        <DidExtrinsic extrinsic={extrinsic} origin={origin}>
          <IdentityChoice identity={identity} />
        </DidExtrinsic>
      )}

      <PasswordField identity={identity} autoFocus password={passwordField} />

      <p className={styles.buttonsLine}>
        <button
          onClick={handleCancelClick}
          type="button"
          className={styles.reject}
        >
          {t('view_SignDidExtrinsic_reject')}
        </button>
        <button
          type="submit"
          className={styles.submit}
          disabled={Boolean(error)}
        >
          {t('common_action_sign')}
        </button>
        <output className={styles.errorTooltip} hidden={!error}>
          {error}
        </output>
      </p>
    </form>
  );
}
