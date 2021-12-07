import { browser } from 'webextension-polyfill-ts';
import { useCallback, useState } from 'react';
import { RequestForAttestation, Attestation } from '@kiltprotocol/core';
import { DefaultResolver } from '@kiltprotocol/did';
import {
  IDidResolvedDetails,
  ISubmitCredential,
  MessageBodyType,
} from '@kiltprotocol/types';

import { Identity } from '../../utilities/identities/types';
import { Credential } from '../../utilities/credentials/credentials';
import { getIdentityDidCrypto } from '../../utilities/identities/identities';
import { usePopupData } from '../../utilities/popups/usePopupData';

import {
  PasswordField,
  usePasswordField,
} from '../../components/PasswordField/PasswordField';
import { IdentitySlide } from '../../components/IdentitySlide/IdentitySlide';

import { ShareInput } from '../../channels/shareChannel/types';
import { shareChannel } from '../../channels/shareChannel/shareChannel';

import * as styles from './ShareCredentialSign.module.css';

interface Props {
  identity: Identity;
  credential: Credential;
  onCancel: () => void;
}

export function ShareCredentialSign({
  identity,
  credential,
  onCancel,
}: Props): JSX.Element {
  const t = browser.i18n.getMessage;

  const data = usePopupData<ShareInput>();

  const { credentialRequest, verifierDid } = data;

  const { challenge } = credentialRequest;

  const [error, setError] = useState<string | null>(null);

  const passwordField = usePasswordField();

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      const { address } = identity;
      const password = await passwordField.get(event);
      const { encrypt, keystore, didDetails } = await getIdentityDidCrypto(
        address,
        password,
      );

      const request = RequestForAttestation.fromRequest(credential.request);
      await request.signWithDid(keystore, didDetails, challenge);

      const attestation = await Attestation.query(request.rootHash);

      if (!attestation) {
        setError(t('view_ShareCredential_error'));
        return;
      }

      const attestedClaim = [{ request, attestation }];

      const credentialsBody: ISubmitCredential = {
        content: attestedClaim,
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
    [identity, credential, passwordField, challenge, verifierDid, t],
  );

  return (
    <form>
      <IdentitySlide identity={identity} />

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
          {t('view_ShareCredential_CTA')}
        </button>
      </p>

      <output className={styles.errorTooltip} hidden={!error}>
        {error}
      </output>
    </form>
  );
}
