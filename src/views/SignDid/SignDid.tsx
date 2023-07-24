import { FormEvent, JSX, useCallback, useRef } from 'react';
import browser from 'webextension-polyfill';

import {
  Credential,
  DidResourceUri,
  ICredential,
  Utils,
} from '@kiltprotocol/sdk-js';

import { without } from 'lodash-es';

import * as styles from './SignDid.module.css';

import { Identity } from '../../utilities/identities/types';
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
  popupData: SignDidOriginInput;
  onCancel: () => void;
  credentials?: SharedCredential[];
}

export function SignDid({
  identity,
  popupData,
  onCancel,
  credentials,
}: Props): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const { origin, plaintext } = popupData;

  const plaintextRef = useRef<HTMLTextAreaElement>(null);
  const copy = useCopyButton(plaintextRef);

  const passwordField = usePasswordField();

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      const { seed } = await passwordField.get(event);

      const { didDocument, authenticationKey } =
        await getIdentityCryptoFromSeed(seed);

      const signature = Utils.Crypto.u8aToHex(
        authenticationKey.sign(plaintext),
      );
      const didKeyUri =
        `${didDocument.uri}${didDocument.authentication[0].id}` as DidResourceUri;

      if (!credentials) {
        await backgroundSignDidChannel.return({ signature, didKeyUri });
        window.close();
        return;
      }

      const presentations: {
        name: string;
        credential: ICredential;
      }[] = [];

      for (const { sporranCredential, sharedContents } of credentials) {
        const { credential } = sporranCredential;
        const allProperties = Object.keys(credential.claim.contents);
        const needRemoving = without(allProperties, ...sharedContents);

        const credentialCopy = Credential.removeClaimProperties(
          credential,
          needRemoving,
        );

        presentations.push({
          name: sporranCredential.name,
          credential: credentialCopy,
        });
      }

      await backgroundSignDidChannel.return({
        credentials: presentations,
        signature,
        didKeyUri,
      });

      window.close();
    },
    [passwordField, plaintext, credentials],
  );

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <h1 className={styles.heading}>{t('view_SignDid_title')}</h1>

      <IdentitySlide identity={identity} />

      {credentials && (
        <dl className={styles.details}>
          <dt className={styles.detailName}>{t('view_SignDid_origin')}</dt>
          <dd className={styles.detailValue}>{origin}</dd>

          <dt className={styles.detailName}>{t('view_SignDid_plaintext')}</dt>
          <dd className={styles.data}>{plaintext}</dd>

          <dt className={styles.detailName}>{t('view_SignDid_credentials')}</dt>
          <dd className={styles.detailValue}>
            {credentials
              .map(({ sporranCredential }) => sporranCredential.name)
              .join(', ')}
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
        <button onClick={onCancel} type="button" className={styles.cancel}>
          {t('common_action_cancel')}
        </button>
        <button type="submit" className={styles.submit}>
          {t('common_action_sign')}
        </button>
      </p>

      <LinkBack />
    </form>
  );
}
