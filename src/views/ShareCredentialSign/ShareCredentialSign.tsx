import { browser } from 'webextension-polyfill-ts';
import { useCallback, useState } from 'react';
import {
  RequestForAttestation,
  Attestation,
  Credential,
} from '@kiltprotocol/core';
import { DefaultResolver } from '@kiltprotocol/did';
import {
  IDidResolvedDetails,
  ISubmitCredential,
  MessageBodyType,
} from '@kiltprotocol/types';

import { getIdentityDidCrypto } from '../../utilities/identities/identities';
import { usePopupData } from '../../utilities/popups/usePopupData';

import { ShareInput } from '../../channels/shareChannel/types';
import { shareChannel } from '../../channels/shareChannel/shareChannel';

import {
  PasswordField,
  usePasswordField,
} from '../../components/PasswordField/PasswordField';
import { IdentitySlide } from '../../components/IdentitySlide/IdentitySlide';

import { Selected } from '../ShareCredential/ShareCredential';

import * as styles from './ShareCredentialSign.module.css';

interface Props {
  selected: Selected;
  onCancel: () => void;
}

export function ShareCredentialSign({
  selected,
  onCancel,
}: Props): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const data = usePopupData<ShareInput>();

  const { credentialRequest, verifierDid } = data;

  const { challenge } = credentialRequest;

  const { credential, identity, sharedProps } = selected;

  const [error, setError] = useState<string | null>(null);

  const passwordField = usePasswordField();

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      const { address } = identity;
      const { password } = await passwordField.get(event);
      const { encrypt, keystore, didDetails } = await getIdentityDidCrypto(
        address,
        password,
      );

      const request = RequestForAttestation.fromRequest(credential.request);
      await request.signWithDid(keystore, didDetails, challenge);

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
        selectedAttributes: sharedProps,
        signer: keystore,
        claimerDid: didDetails,
        challenge,
      });

      const credentialsBody: ISubmitCredential = {
        content: [presentation],
        type: MessageBodyType.SUBMIT_CREDENTIAL,
      };

      const { details: verifierDidDetails } = (await DefaultResolver.resolveDoc(
        verifierDid,
      )) as IDidResolvedDetails;
      if (!verifierDidDetails) {
        throw new Error(`Cannot resolve the DID ${verifierDid}`);
      }

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
      sharedProps,
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

          {sharedProps.map((sharedProp) => (
            <div key={sharedProp} className={styles.detail}>
              <dt className={styles.detailName}>{sharedProp}</dt>
              <dd className={styles.detailValue}>
                {credential.request.claim.contents[sharedProp]}
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
