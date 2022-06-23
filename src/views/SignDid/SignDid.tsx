import { useCallback, useRef } from 'react';
import { browser } from 'webextension-polyfill-ts';

import {
  RequestForAttestation,
  Attestation,
  Credential,
} from '@kiltprotocol/core';

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
import { useBooleanState } from '../../utilities/useBooleanState/useBooleanState';

interface Props {
  identity: Identity;
  popupData: SignDidOriginInput | undefined;
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

  const plaintextRef = useRef<HTMLTextAreaElement>(null);
  const copy = useCopyButton(plaintextRef);

  const passwordField = usePasswordField();

  const error = useBooleanState();

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      error.off();

      try {
        if (!popupData) {
          throw new Error('No popup data');
        }

        const { seed } = await passwordField.get(event);
        const { sign, keystore, didDetails } = await getIdentityCryptoFromSeed(
          seed,
        );

        const signature = sign(popupData.plaintext);

        if (!credentials) {
          await backgroundSignDidChannel.return(signature);
        }

        if (credentials) {
          const presentations = [];

          for (const { credential, sharedContents } of credentials) {
            const request = RequestForAttestation.fromRequest(
              credential.request,
            );

            const attestation = await Attestation.query(request.rootHash);
            if (!attestation) {
              throw new Error(
                `Unable to verify attestation for ${credential.name}`,
              );
            }

            const credentialInstance = Credential.fromCredential({
              request,
              attestation,
            });
            const presentation = await credentialInstance.createPresentation({
              selectedAttributes: sharedContents,
              signer: keystore,
              claimerDid: didDetails,
            });

            presentations.push({
              name: credential.name,
              credential: presentation,
            });
          }

          await backgroundSignDidChannel.return({
            ...presentations,
            ...signature,
          });
        }

        window.close();
      } catch (exception) {
        console.error(exception);
        error.on();
      }
    },
    [passwordField, popupData, credentials, error],
  );

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <h1 className={styles.heading}>{t('view_SignDid_title')}</h1>

      <IdentitySlide identity={identity} />

      {credentials && (
        <dl className={styles.details}>
          <dt className={styles.detailName}>{t('view_SignDid_origin')}</dt>
          <dd className={styles.detailValue}>{popupData?.origin}</dd>

          <dt className={styles.detailName}>{t('view_SignDid_plaintext')}</dt>
          <dd className={styles.data}>{popupData?.plaintext}</dd>

          <dt className={styles.detailName}>{t('view_SignDid_credentials')}</dt>
          <dd className={styles.detailValue}>
            {credentials.map(({ credential }) => credential.name).join(', ')}
          </dd>
        </dl>
      )}

      {!credentials && (
        <section className={styles.noCredentials}>
          <p className={styles.label}>{t('view_SignDid_origin')}</p>
          <p className={styles.origin}>{popupData?.origin}</p>

          <p className={styles.label} id="plaintext">
            {t('view_SignDid_plaintext')}
          </p>
          <p className={styles.plaintextLine}>
            <textarea
              className={styles.plaintext}
              readOnly
              aria-labelledby="plaintext"
              value={popupData?.plaintext}
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
        <output className={styles.errorTooltip} hidden={!error.current}>
          {t('view_SignDid_error')}
        </output>
      </p>

      <LinkBack />
    </form>
  );
}
