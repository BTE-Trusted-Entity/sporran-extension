import { FormEvent, useCallback } from 'react';
import browser from 'webextension-polyfill';

import { getStoreTx } from '@kiltprotocol/did';

import * as styles from './CreateDidDApp.module.css';

import { CreateDidOriginInput } from '../../channels/CreateDidChannels/types';
import {
  PasswordField,
  usePasswordField,
} from '../../components/PasswordField/PasswordField';
import { isFullDid } from '../../utilities/did/did';

import { Identity } from '../../utilities/identities/types';
import { usePopupData } from '../../utilities/popups/usePopupData';
import { IdentitiesCarousel } from '../../components/IdentitiesCarousel/IdentitiesCarousel';
import { IdentitySlide } from '../../components/IdentitySlide/IdentitySlide';

import { backgroundCreateDidChannel } from '../../channels/CreateDidChannels/backgroundCreateDidChannel';
import { getIdentityCryptoFromSeed } from '../../utilities/identities/identities';

interface Props {
  identity: Identity;
}

export function CreateDidDApp({ identity }: Props) {
  const t = browser.i18n.getMessage;

  const { did } = identity;

  const { origin, submitter, pendingDidUri } =
    usePopupData<CreateDidOriginInput>();

  const passwordField = usePasswordField();

  const error = [
    isFullDid(did) && t('view_CreateDidDApp_error_full_did'),
    !did && t('view_CreateDidDApp_error_did_removed'),
  ].filter(Boolean)[0];

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      const { seed } = await passwordField.get(event);

      const { authenticationKey, encryptionKey, didDocument, signers } =
        await getIdentityCryptoFromSeed(seed);

      if (!didDocument.authentication) {
        throw new Error(
          'At least one authentication key required to create DID',
        );
      }

      const storeTx = await getStoreTx(
        { authentication: [authenticationKey], keyAgreement: [encryptionKey] },
        submitter,
        signers,
      );
      const signedExtrinsic = storeTx.method.toHex();

      await backgroundCreateDidChannel.return({ signedExtrinsic });
      window.close();
    },
    [passwordField, submitter],
  );

  const handleCancel = useCallback(async () => {
    await backgroundCreateDidChannel.throw('Rejected');
    window.close();
  }, []);

  const identityIsPredetermined = did && did === pendingDidUri;

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <h1 className={styles.heading}>{t('view_CreateDidDApp_heading')}</h1>

      {identityIsPredetermined ? (
        <IdentitySlide identity={identity} />
      ) : (
        <IdentitiesCarousel identity={identity} />
      )}

      <section className={styles.details}>
        <p className={styles.label}>{t('view_CreateDidDApp_origin')}</p>
        <p className={styles.origin}>{origin}</p>
      </section>

      <PasswordField identity={identity} autoFocus password={passwordField} />

      <p className={styles.buttonsLine}>
        <button onClick={handleCancel} type="button" className={styles.reject}>
          {t('common_action_cancel')}
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
