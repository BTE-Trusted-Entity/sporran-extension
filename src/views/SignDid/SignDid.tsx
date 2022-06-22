import { useCallback, useRef } from 'react';
import { browser } from 'webextension-polyfill-ts';

import * as styles from './SignDid.module.css';

import { Identity } from '../../utilities/identities/types';
import { usePopupData } from '../../utilities/popups/usePopupData';
import { getIdentityCryptoFromSeed } from '../../utilities/identities/identities';

import {
  PasswordField,
  usePasswordField,
} from '../../components/PasswordField/PasswordField';
import { backgroundSignDidChannel } from '../../channels/SignDidChannels/backgroundSignDidChannel';
import { SignDidOriginInput } from '../../channels/SignDidChannels/types';
import { IdentitySlide } from '../../components/IdentitySlide/IdentitySlide';
import { useCopyButton } from '../../components/useCopyButton/useCopyButton';
import { LinkBack } from '../../components/LinkBack/LinkBack';
import { SharedCredential } from '../../utilities/credentials/credentials';

interface Props {
  identity: Identity;
  credentials?: SharedCredential[];
}

export function SignDid({ identity, credentials }: Props): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const { origin, plaintext } = usePopupData<SignDidOriginInput>();

  const plaintextRef = useRef<HTMLTextAreaElement>(null);
  const copy = useCopyButton(plaintextRef);

  const passwordField = usePasswordField();

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      const { seed } = await passwordField.get(event);
      const { sign } = await getIdentityCryptoFromSeed(seed);

      await backgroundSignDidChannel.return(sign(plaintext));

      window.close();
    },
    [passwordField, plaintext],
  );

  const handleSubmitCredentials = useCallback(
    async (event) => {
      event.preventDefault();

      const { seed } = await passwordField.get(event);
      const { sign, keystore, didDetails } = await getIdentityCryptoFromSeed(
        seed,
      );

      const signature = sign(plaintext);

      await backgroundSignDidChannel.return(sign(plaintext));

      window.close();
    },
    [passwordField, plaintext],
  );

  const handleCancelClick = useCallback(async () => {
    await backgroundSignDidChannel.throw('Rejected');
    window.close();
  }, []);

  return (
    <form
      className={styles.container}
      onSubmit={credentials?.length ? handleSubmitCredentials : handleSubmit}
    >
      <h1 className={styles.heading}>{t('view_SignDid_title')}</h1>

      <IdentitySlide identity={identity} />

      {credentials && (
        <dl className={styles.details}>
          <dt className={styles.detailName}>{t('view_SignDid_origin')}</dt>
          <dd className={styles.detailValue}>{origin}</dd>

          <dt className={styles.detailName}>{t('view_SignDid_plaintext')}</dt>
          <dd className={styles.data}>{plaintext}</dd>

          <dt className={styles.detailName}>
            {credentials.length === 1
              ? t('view_SignDid_credential')
              : t('view_SignDid_credentials')}
          </dt>
          <dd className={styles.detailValue}>
            {credentials.map(({ credential }) => credential.name).join(', ')}
          </dd>
        </dl>
      )}

      {!credentials && (
        <section className={styles.noCredentials}>
          <p className={styles.label}>{t('view_SignDid_origin')}</p>
          <p className={styles.origin}>{origin}</p>

          <p className={styles.label} id="plaintext">
            {t('view_SignDid_plaintext')}
          </p>
          <p className={styles.plaintextLine}>
            <textarea
              className={styles.plaintext}
              readOnly
              aria-labelledby="plaintext"
              value={plaintext}
              ref={plaintextRef}
            />
            {copy.supported && (
              <button
                className={copy.className}
                onClick={copy.handleCopyClick}
                type="button"
                aria-label={copy.title}
                title={copy.title}
              />
            )}
          </p>
        </section>
      )}

      <PasswordField identity={identity} autoFocus password={passwordField} />

      <p className={styles.buttonsLine}>
        <button
          onClick={handleCancelClick}
          type="button"
          className={styles.reject}
        >
          {t('view_SignDid_reject')}
        </button>
        <button type="submit" className={styles.submit}>
          {t('common_action_sign')}
        </button>
      </p>

      <LinkBack />
    </form>
  );
}
