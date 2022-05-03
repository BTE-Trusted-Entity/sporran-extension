import { Fragment, useCallback } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { BaseDidKey } from '@kiltprotocol/types';
import { GenericExtrinsic } from '@polkadot/types';

import { Switch, Route, Redirect, useLocation } from 'react-router-dom';

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

import { paths } from '../paths';

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
  onCancel,
}: {
  identity: Identity;
  extrinsic: GenericExtrinsic;
  onCancel: () => Promise<void>;
}): JSX.Element {
  const t = browser.i18n.getMessage;

  const { signer } = usePopupData<SignDidExtrinsicOriginInput>();

  const { did } = identity;

  const error = !isFullDid(did) && t('view_SignDidExtrinsic_error_light_did');

  const values = getAddServiceEndpointValues(extrinsic);

  const passwordField = usePasswordField();

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      if (!extrinsic) {
        throw new Error('No extrinsic to sign');
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
    [extrinsic, signer, passwordField, did],
  );

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <h1 className={styles.heading}>
        {t('view_SignDidExtrinsic_endpoint_title_add')}
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

      <EndpointValues values={values} />

      <PasswordField identity={identity} autoFocus password={passwordField} />

      <p className={styles.buttonsLine}>
        <button onClick={onCancel} type="button" className={styles.reject}>
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

function RemoveServiceEndpointExtrinsic({
  identity,
  extrinsic,
  onCancel,
}: {
  identity: Identity;
  extrinsic: GenericExtrinsic;
  onCancel: () => Promise<void>;
}): JSX.Element {
  const t = browser.i18n.getMessage;

  const { signer } = usePopupData<SignDidExtrinsicOriginInput>();

  const { did } = identity;

  const passwordField = usePasswordField();

  const { values, error: removeEndpointError } = useRemoveServiceEndpointValues(
    extrinsic,
    did,
  );

  const error = [
    !isFullDid(identity.did) && t('view_SignDidExtrinsic_error_light_did'),
    removeEndpointError,
  ].filter(Boolean)[0];

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      if (!extrinsic) {
        throw new Error('No extrinsic to sign');
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
    [extrinsic, signer, passwordField, did],
  );

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <h1 className={styles.heading}>
        {t('view_SignDidExtrinsic_endpoint_title_remove')}
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

      <EndpointValues values={values} />

      <PasswordField identity={identity} autoFocus password={passwordField} />

      <p className={styles.buttonsLine}>
        <button onClick={onCancel} type="button" className={styles.reject}>
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

function DidExtrinsic({
  identity,
  extrinsic,
  onCancel,
}: {
  identity: Identity;
  extrinsic: GenericExtrinsic;
  onCancel: () => Promise<void>;
}) {
  // Redirect does not preserve search query
  const { search } = useLocation();

  const t = browser.i18n.getMessage;

  const { signer, origin } = usePopupData<SignDidExtrinsicOriginInput>();

  const { did } = identity;

  const values = getExtrinsicValues(extrinsic, origin);

  const passwordField = usePasswordField();

  const isForbidden = extrinsic.method.section === 'did';

  const error = [
    !isFullDid(identity.did) && t('view_SignDidExtrinsic_error_light_did'),
    isForbidden && t('view_SignDidExtrinsic_error_forbidden'),
  ].filter(Boolean)[0];

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      if (!extrinsic) {
        throw new Error('No extrinsic to sign');
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

  if (extrinsic.method.method === 'addServiceEndpoint') {
    return <Redirect to={{ pathname: paths.popup.addEndpoint, search }} />;
  }

  if (extrinsic.method.method === 'removeServiceEndpoint') {
    return <Redirect to={{ pathname: paths.popup.removeEndpoint, search }} />;
  }

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
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

      <PasswordField identity={identity} autoFocus password={passwordField} />

      <p className={styles.buttonsLine}>
        <button onClick={onCancel} type="button" className={styles.reject}>
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

interface Props {
  identity: Identity;
}

export function SignDidExtrinsic({ identity }: Props): JSX.Element | null {
  const data = usePopupData<SignDidExtrinsicOriginInput>();

  const extrinsic = useExtrinsic(data);

  const handleCancelClick = useCallback(async () => {
    await backgroundSignDidExtrinsicChannel.throw('Rejected');
    window.close();
  }, []);

  if (!extrinsic) {
    return null;
  }

  return (
    <Switch>
      <Route path={paths.popup.addEndpoint}>
        <AddServiceEndpointExtrinsic
          identity={identity}
          extrinsic={extrinsic}
          onCancel={handleCancelClick}
        />
      </Route>
      <Route path={paths.popup.removeEndpoint}>
        <RemoveServiceEndpointExtrinsic
          identity={identity}
          extrinsic={extrinsic}
          onCancel={handleCancelClick}
        />
      </Route>
      <Route path={paths.popup.signDidExtrinsic}>
        <DidExtrinsic
          identity={identity}
          extrinsic={extrinsic}
          onCancel={handleCancelClick}
        />
      </Route>
    </Switch>
  );
}
