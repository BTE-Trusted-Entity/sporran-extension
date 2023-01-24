import { FormEvent, useCallback } from 'react';
import { browser } from 'webextension-polyfill-ts';
import * as Did from '@kiltprotocol/did';

import * as styles from './ASUserData.module.css';

import { ASUserDataOriginInput } from '../../channels/ASUserDataChannels/types';
import {
  PasswordField,
  usePasswordField,
} from '../../components/PasswordField/PasswordField';
import { isFullDid, parseDidUri } from '../../utilities/did/did';

import { Identity } from '../../utilities/identities/types';
import { usePopupData } from '../../utilities/popups/usePopupData';
import { IdentitiesCarousel } from '../../components/IdentitiesCarousel/IdentitiesCarousel';

import { backgroundASUserDataChannel } from '../../channels/ASUserDataChannels/backgroundASUserDataChannel';
import { getIdentityCryptoFromSeed } from '../../utilities/identities/identities';

// const ASUserCType: ICType = {};

interface Props {
  identity: Identity;
}

export function ASUserData({ identity }: Props): JSX.Element {
  const t = browser.i18n.getMessage;

  const { did } = identity;

  const { origin, submitter } = usePopupData<ASUserDataOriginInput>();

  const passwordField = usePasswordField();

  const error = [
    isFullDid(did) && t('view_ASUserData_error_full_did'),
    !did && t('view_ASUserData_error_did_removed'),
  ].filter(Boolean)[0];

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const formData = new FormData(event.currentTarget);
      const name = (formData.get('name') as string).trim();
      const email = (formData.get('email') as string).trim();

      const { seed } = await passwordField.get(event);

      const { didDocument, sign } = await getIdentityCryptoFromSeed(seed);
      const { fullDid: did } = parseDidUri(didDocument.uri);

      const storeTx = await Did.getStoreTx(
        didDocument,
        submitter,
        async (input) => sign({ ...input, did }),
      );
      const createDidExtrinsic = storeTx.method.toHex();

      await backgroundASUserDataChannel.return({
        createDidExtrinsic,
        name,
        email,
      });
      window.close();
    },
    [passwordField, submitter],
  );

  const handleCancel = useCallback(async () => {
    await backgroundASUserDataChannel.throw('Rejected');
    window.close();
  }, []);

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <h1 className={styles.heading}>{t('view_ASUserData_heading')}</h1>

      <IdentitiesCarousel identity={identity} />

      <section className={styles.details}>
        <p className={styles.label}>{t('view_ASUserData_origin')}</p>
        <p className={styles.origin}>{origin}</p>
      </section>

      <input
        className={styles.input}
        type="text"
        name="name"
        placeholder={t('view_ASUserData_name')}
        required
      />

      <input
        className={styles.input}
        type="email"
        name="email"
        placeholder={t('view_ASUserData_email')}
        required
      />

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
