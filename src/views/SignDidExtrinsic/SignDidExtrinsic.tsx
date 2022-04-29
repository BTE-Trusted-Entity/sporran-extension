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

import {
  useExtrinsicValues,
  useExtrinsic,
  getServiceEndpointValues,
} from './useExtrinsic';

function DidExtrinsic({
  identity,
  extrinsic,
}: {
  identity: Identity;
  extrinsic: GenericExtrinsic;
}) {
  const t = browser.i18n.getMessage;

  const data = usePopupData<SignDidExtrinsicOriginInput>();
  const { origin } = data;

  const values = useExtrinsicValues(extrinsic, origin);

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
function AddServiceEndpointExtrinsic({
  identity,
  extrinsic,
}: {
  identity: Identity;
  extrinsic: GenericExtrinsic;
}): JSX.Element {
  const t = browser.i18n.getMessage;

  const { did } = identity;

  const values = getServiceEndpointValues(extrinsic);

  return (
    <Fragment>
      <h1 className={styles.heading}>
        {t('view_SignDidExtrinsic_endpoint_title')}
      </h1>
      <p className={styles.subline}>
        {t('view_SignDidExtrinsic_endpoint_subline')}
      </p>

      <IdentitiesCarousel identity={identity} />

      {isFullDid(did) && (
        <CopyValue
          value={identity.did}
          label="DID"
          className={styles.didLine}
        />
      )}

      <dl className={styles.endpointDetails}>
        <div className={styles.fullWidthDetail}>
          <dt className={styles.endpointName}>
            {t('view_SignDidExtrinsic_endpoint_url')}
          </dt>
          <dd className={styles.endpointValue}>{values.urls[0]}</dd>
        </div>
        <div className={styles.endpointDetail}>
          <dt className={styles.endpointName}>
            {t('view_SignDidExtrinsic_endpoint_type')}
          </dt>
          <dd className={styles.endpointValue}>{values.serviceTypes[0]}</dd>
        </div>
        <div className={styles.endpointDetail}>
          <dt className={styles.endpointName}>
            {t('view_SignDidExtrinsic_endpoint_id')}
          </dt>
          <dd className={styles.endpointValue}>{getFragment(values.id)}</dd>
        </div>
      </dl>
    </Fragment>
  );
}

interface Props {
  identity: Identity;
}

export function SignDidExtrinsic({ identity }: Props): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const data = usePopupData<SignDidExtrinsicOriginInput>();
  const { signer } = data;

  const extrinsic = useExtrinsic(data);

  const isAddServiceEndpointExtrinsic =
    extrinsic?.method.method === 'addServiceEndpoint';

  const isForbidden =
    extrinsic?.method.section === 'did' && !isAddServiceEndpointExtrinsic;

  const error = [
    !isFullDid(identity.did) && t('view_SignDidExtrinsic_error_light_did'),
    isForbidden && t('view_SignDidExtrinsic_error_forbidden'),
  ].filter(Boolean)[0];

  const passwordField = usePasswordField();

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      if (!extrinsic) {
        throw new Error('No extrinsic to sign');
      }

      if (isForbidden) {
        throw new Error('Signing DID calls not allowed');
      }

      const fullDidDetails = await getFullDidDetails(identity.did);

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
    [extrinsic, isForbidden, identity.did, passwordField, signer],
  );

  const handleCancelClick = useCallback(async () => {
    await backgroundSignDidExtrinsicChannel.throw('Rejected');
    window.close();
  }, []);

  if (!extrinsic) {
    return null;
  }

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      {isAddServiceEndpointExtrinsic ? (
        <AddServiceEndpointExtrinsic
          identity={identity}
          extrinsic={extrinsic}
        />
      ) : (
        <DidExtrinsic identity={identity} extrinsic={extrinsic} />
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
