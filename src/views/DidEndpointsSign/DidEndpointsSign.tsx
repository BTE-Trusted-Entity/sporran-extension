import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { browser } from 'webextension-polyfill-ts';
import { IDidServiceEndpoint } from '@kiltprotocol/types';
import { DidChain, FullDidDetails } from '@kiltprotocol/did';

import { Identity } from '../../utilities/identities/types';
import { IdentitySlide } from '../../components/IdentitySlide/IdentitySlide';
import { LinkBack } from '../../components/LinkBack/LinkBack';
import { Stats } from '../../components/Stats/Stats';
import {
  PasswordField,
  usePasswordField,
} from '../../components/PasswordField/PasswordField';
import { TxStatusModal } from '../../components/TxStatusModal/TxStatusModal';
import { getKeystoreFromKeypair } from '../../utilities/identities/identities';
import { useSubmitStates } from '../../utilities/useSubmitStates/useSubmitStates';
import { getFragment } from '../../utilities/did/did';
import { generatePath, paths } from '../paths';

import * as styles from './DidEndpointsSign.module.css';

interface Props {
  identity: Identity;
  type: 'add' | 'remove';
  endpoint: IDidServiceEndpoint;
  fullDidDetails: FullDidDetails;
}

export function DidEndpointsSign({
  identity,
  type,
  endpoint,
  fullDidDetails,
}: Props): JSX.Element {
  const t = browser.i18n.getMessage;

  const passwordField = usePasswordField();
  const { submit, modalProps, submitting } = useSubmitStates();

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      // getRemoveEndpointExtrinsic expects just the fragment part, contrary to its type definition
      const draft =
        type === 'add'
          ? await DidChain.getAddEndpointExtrinsic(endpoint)
          : await DidChain.getRemoveEndpointExtrinsic(getFragment(endpoint.id));

      const { keypair } = await passwordField.get(event);

      const authorized = await fullDidDetails.authorizeExtrinsic(
        draft,
        getKeystoreFromKeypair(keypair),
        keypair.address,
      );

      await submit(keypair, authorized);
    },
    [endpoint, fullDidDetails, passwordField, submit, type],
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

      <p className={styles.value}>{endpoint.urls[0]}</p>
      <p className={styles.value}>{endpoint.types[0]}</p>
      <p className={styles.value}>{getFragment(endpoint.id)}</p>

      <PasswordField identity={identity} autoFocus password={passwordField} />

      <p className={styles.buttonsLine}>
        <Link to={paths.home} className={styles.cancel}>
          {t('common_action_cancel')}
        </Link>
        <button type="submit" className={styles.submit} disabled={submitting}>
          {t('view_DidEndpointsSign_CTA')}
        </button>
        {/*<output className={styles.errorTooltip} hidden={!error}>
          {t('view_DidDowngrade_insufficientFunds', asKiltCoins(fee, 'costs'))}
        </output>*/}
      </p>

      {modalProps && (
        <TxStatusModal
          {...modalProps}
          identity={identity}
          messages={type === 'add' ? modalMessagesAdd : modalMessagesRemove}
          destination={generatePath(paths.identity.did.endpoints.start, {
            address: identity.address,
          })}
        />
      )}

      <LinkBack />
      <Stats />
    </form>
  );
}
