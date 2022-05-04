import { Fragment, useCallback } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { BaseDidKey } from '@kiltprotocol/types';
import { GenericExtrinsic } from '@polkadot/types';

import * as styles from './SignDidExtrinsic.module.css';

import { Identity } from '../../utilities/identities/types';
import { usePopupData } from '../../utilities/popups/usePopupData';
import { getIdentityCryptoFromSeed } from '../../utilities/identities/identities';
import {
  getFragment,
  getFullDidDetails,
  isFullDid,
} from '../../utilities/did/did';
import { IdentitiesCarousel } from '../../components/IdentitiesCarousel/IdentitiesCarousel';
import {
  PasswordField,
  usePasswordField,
} from '../../components/PasswordField/PasswordField';
import { backgroundSignDidExtrinsicChannel } from '../../channels/SignDidExtrinsicChannels/backgroundSignDidExtrinsicChannel';
import { SignDidExtrinsicOriginInput } from '../../channels/SignDidExtrinsicChannels/types';

import { CopyValue } from '../../components/CopyValue/CopyValue';
import { useBooleanState } from '../../utilities/useBooleanState/useBooleanState';

import {
  getExtrinsicValues,
  getAddServiceEndpointValues,
  useExtrinsic,
  useRemoveServiceEndpointValues,
} from './useExtrinsic';

function EndpointValues({
  values,
}: {
  values: {
    id: string;
    serviceTypes?: string[];
    urls?: string[];
  };
}): JSX.Element {
  const t = browser.i18n.getMessage;

  return (
    <dl className={styles.endpointDetails}>
      {values.urls && values.urls.length > 0 && (
        <div className={styles.fullWidthDetail}>
          <dt className={styles.endpointName}>
            {t('view_SignDidExtrinsic_endpoint_url')}
          </dt>
          <dd className={styles.endpointValue}>{values.urls[0]}</dd>
        </div>
      )}

      {values.serviceTypes && values.serviceTypes.length > 0 && (
        <div className={styles.endpointDetail}>
          <dt className={styles.endpointName}>
            {t('view_SignDidExtrinsic_endpoint_type')}
          </dt>
          <dd className={styles.endpointValue}>{values.serviceTypes[0]}</dd>
        </div>
      )}

      <div className={styles.endpointDetail}>
        <dt className={styles.endpointName}>
          {t('view_SignDidExtrinsic_endpoint_id')}
        </dt>
        <dd className={styles.endpointValue}>{getFragment(values.id)}</dd>
      </div>
    </dl>
  );
}
function AddServiceEndpointExtrinsic({
  identity,
  extrinsic,
}: {
  identity: Identity;
  extrinsic: GenericExtrinsic;
}): JSX.Element {
  const t = browser.i18n.getMessage;

  const { did } = identity;

  const values = getAddServiceEndpointValues(extrinsic);

  return (
    <Fragment>
      <h1 className={styles.heading}>
        {t('view_SignDidExtrinsic_endpoint_title_add')}
      </h1>
      <p className={styles.subline}>
        {t('view_SignDidExtrinsic_endpoint_subline')}
      </p>

      <IdentitiesCarousel identity={identity} />

      {isFullDid(did) && (
        <CopyValue value={did} label="DID" className={styles.didLine} />
      )}

      <EndpointValues values={values} />
    </Fragment>
  );
}

function RemoveServiceEndpointExtrinsic({
  identity,
  extrinsic,
  error,
}: {
  identity: Identity;
  extrinsic: GenericExtrinsic;
  error: ReturnType<typeof useBooleanState>;
}): JSX.Element {
  const t = browser.i18n.getMessage;

  const { did } = identity;

  const values = useRemoveServiceEndpointValues(extrinsic, did, error);

  return (
    <Fragment>
      <h1 className={styles.heading}>
        {t('view_SignDidExtrinsic_endpoint_title_remove')}
      </h1>
      <p className={styles.subline}>
        {t('view_SignDidExtrinsic_endpoint_subline')}
      </p>

      <IdentitiesCarousel identity={identity} />

      {isFullDid(did) && (
        <CopyValue value={did} label="DID" className={styles.didLine} />
      )}

      <EndpointValues values={values} />
    </Fragment>
  );
}

function DidExtrinsic({
  identity,
  extrinsic,
  origin,
}: {
  identity: Identity;
  extrinsic: GenericExtrinsic;
  origin: string;
}) {
  const t = browser.i18n.getMessage;

  const values = getExtrinsicValues(extrinsic, origin);

  return (
    <Fragment>
      <h1 className={styles.heading}>{t('view_SignDidExtrinsic_title')}</h1>
      <p className={styles.subline}>{t('view_SignDidExtrinsic_subline')}</p>

      <IdentitiesCarousel identity={identity} />

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

export function SignDidExtrinsic({ identity }: Props): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const { did } = identity;

  const data = usePopupData<SignDidExtrinsicOriginInput>();

  const { signer, origin } = data;

  const extrinsic = useExtrinsic(data);

  const removeEndpointError = useBooleanState();

  const extrinsicMethod = extrinsic?.method.method;

  const isServiceEndpointExtrinsic =
    extrinsicMethod === 'addServiceEndpoint' ||
    extrinsicMethod === 'removeServiceEndpoint';

  const isForbidden =
    extrinsic?.method.section === 'did' && !isServiceEndpointExtrinsic;

  const error = [
    !isFullDid(did) && t('view_SignDidExtrinsic_error_light_did'),
    isForbidden && t('view_SignDidExtrinsic_error_forbidden'),
    removeEndpointError.current &&
      t('view_SignDidExtrinsic_endpoint_remove_error'),
  ].filter(Boolean)[0];

  const passwordField = usePasswordField();

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      if (!extrinsic) {
        throw new Error('Missing extrinsic');
      }

      if (isForbidden) {
        throw new Error('This DID call is forbidden');
      }

      const fullDidDetails = await getFullDidDetails(did);

      const { seed } = await passwordField.get(event);
      const { keystore } = await getIdentityCryptoFromSeed(seed);

      let didKey: BaseDidKey | undefined;
      const authorized = await fullDidDetails.authorizeExtrinsic(
        extrinsic,
        keystore,
        signer,
        {
          async keySelection([key]) {
            didKey = key;
            return key;
          },
        },
      );

      if (!didKey) {
        throw new Error('No extrinsic signing key stored');
      }
      const didKeyUri = fullDidDetails.assembleKeyId(didKey.id);
      const signed = authorized.toHex();

      await backgroundSignDidExtrinsicChannel.return({ signed, didKeyUri });

      window.close();
    },
    [extrinsic, signer, passwordField, did, isForbidden],
  );

  const handleCancelClick = useCallback(async () => {
    await backgroundSignDidExtrinsicChannel.throw('Rejected');
    window.close();
  }, []);

  if (!extrinsic) {
    return null; // blockchain data pending
  }

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      {extrinsicMethod === 'addServiceEndpoint' && (
        <AddServiceEndpointExtrinsic
          identity={identity}
          extrinsic={extrinsic}
        />
      )}

      {extrinsicMethod === 'removeServiceEndpoint' && (
        <RemoveServiceEndpointExtrinsic
          identity={identity}
          extrinsic={extrinsic}
          error={removeEndpointError}
        />
      )}

      {!isServiceEndpointExtrinsic && (
        <DidExtrinsic
          identity={identity}
          extrinsic={extrinsic}
          origin={origin}
        />
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
