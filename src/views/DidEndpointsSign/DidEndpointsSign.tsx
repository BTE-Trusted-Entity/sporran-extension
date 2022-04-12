import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { browser } from 'webextension-polyfill-ts';
import { DidServiceEndpoint } from '@kiltprotocol/types';
import { DidChain } from '@kiltprotocol/did';

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
import { getKeystoreFromSeed } from '../../utilities/identities/identities';
import { useSubmitStates } from '../../utilities/useSubmitStates/useSubmitStates';
import { getFragment, useFullDidDetails } from '../../utilities/did/did';
import { generatePath, paths } from '../paths';

interface Props {
  identity: Identity;
  type: 'add' | 'remove';
  endpoint: DidServiceEndpoint;
}

export function DidEndpointsSign({
  identity,
  type,
  endpoint,
}: Props): JSX.Element {
  const t = browser.i18n.getMessage;
  const { address, did } = identity;

  const fullDidDetails = useFullDidDetails(did);

  const passwordField = usePasswordField();
  const { submit, modalProps, submitting, unpaidCosts } = useSubmitStates();

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      if (!fullDidDetails) {
        return;
      }

      const { keypair, seed } = await passwordField.get(event);

      // getRemoveEndpointExtrinsic expects just the fragment part, contrary to its type definition
      const draft =
        type === 'add'
          ? await DidChain.getAddEndpointExtrinsic(endpoint)
          : await DidChain.getRemoveEndpointExtrinsic(getFragment(endpoint.id));

      const authorized = await fullDidDetails.authorizeExtrinsic(
        draft,
        await getKeystoreFromSeed(seed),
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

      <CopyValue value={identity.did} label="DID" className={styles.didLine} />

      <p className={styles.value}>{endpoint.urls[0]}</p>
      <p className={styles.value}>{endpoint.types[0]}</p>
      <p className={styles.value}>{getFragment(endpoint.id)}</p>

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
