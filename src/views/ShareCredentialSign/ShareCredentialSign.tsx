import { browser } from 'webextension-polyfill-ts';
import { FormEvent, useCallback, useState } from 'react';
import {
  Attestation,
  Credential,
  RequestForAttestation,
} from '@kiltprotocol/core';
import { ISubmitCredential, MessageBodyType } from '@kiltprotocol/types';

import * as styles from './ShareCredentialSign.module.css';

import { getIdentityCryptoFromSeed } from '../../utilities/identities/identities';

import { ShareInput } from '../../channels/shareChannel/types';
import { shareChannel } from '../../channels/shareChannel/shareChannel';

import {
  PasswordField,
  usePasswordField,
} from '../../components/PasswordField/PasswordField';
import { IdentitySlide } from '../../components/IdentitySlide/IdentitySlide';

import { Selected } from '../ShareCredential/ShareCredential';

import { getDidDetails, needLegacyDidCrypto } from '../../utilities/did/did';

interface Props {
  selected: Selected;
  onCancel: () => void;
  popupData: ShareInput;
}

export function ShareCredentialSign({
  selected,
  onCancel,
  popupData,
}: Props): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const { credentialRequest, verifierDid } = popupData;

  const { challenge } = credentialRequest;

  const { credential, identity, sharedContents } = selected;

  const [error, setError] = useState<string>();

  const passwordField = usePasswordField();

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      const { seed } = await passwordField.get(event);

      const isLegacy = await needLegacyDidCrypto(identity.did);
      const { encrypt, keystore, didDetails } = await getIdentityCryptoFromSeed(
        seed,
        isLegacy,
      );

      const request = RequestForAttestation.fromRequest(credential.request);
      await request.signWithDidKey(
        keystore,
        didDetails,
        didDetails.authenticationKey.id,
        { challenge },
      );

      const attestation = await Attestation.query(request.rootHash);

      if (!attestation) {
        setError(t('view_ShareCredentialSign_error'));
        return;
      }

      const credentialInstance = Credential.fromCredential({
        request,
        attestation,
      });

      const presentation = await credentialInstance.createPresentation({
        selectedAttributes: sharedContents,
        signer: keystore,
        claimerDid: didDetails,
        challenge,
      });

      const credentialsBody: ISubmitCredential = {
        content: [presentation],
        type: MessageBodyType.SUBMIT_CREDENTIAL,
      };

      const verifierDidDetails = await getDidDetails(verifierDid);

      const message = await encrypt(credentialsBody, verifierDidDetails);

      await shareChannel.return(message);
      window.close();
    },
    [
      credential,
      identity,
      passwordField,
      challenge,
      verifierDid,
      t,
      sharedContents,
    ],
  );

  if (!selected) {
    return null;
  }

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <h1 className={styles.heading}>
        {t('view_ShareCredentialSign_heading')}
      </h1>
      <p className={styles.subline}>{t('view_ShareCredentialSign_subline')}</p>

      <IdentitySlide identity={identity} />

      <section className={styles.detailsContainer}>
        <dl className={styles.details}>
          <div className={styles.name}>
            <dt className={styles.detailName}>
              {t('view_ShareCredentialSign_name')}
            </dt>
            <dd className={styles.detailValue}>{credential.name}</dd>
          </div>

          {sharedContents.map((sharedProp) => (
            <div key={sharedProp} className={styles.detail}>
              <dt className={styles.detailName}>{sharedProp}</dt>
              <dd className={styles.detailValue}>
                {String(credential.request.claim.contents[sharedProp])}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <PasswordField identity={identity} password={passwordField} />

      <p className={styles.buttonsLine}>
        <button type="button" className={styles.cancel} onClick={onCancel}>
          {t('common_action_cancel')}
        </button>
        <button
          type="submit"
          className={styles.submit}
          disabled={passwordField.isEmpty}
        >
          {t('view_ShareCredentialSign_CTA')}
        </button>
      </p>

      <output className={styles.errorTooltip} hidden={!error}>
        {error}
      </output>
    </form>
  );
}
