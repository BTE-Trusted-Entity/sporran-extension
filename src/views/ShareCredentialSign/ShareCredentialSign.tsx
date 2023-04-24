import { browser } from 'webextension-polyfill-ts';
import { FormEvent, useCallback, useState } from 'react';
import {
  Attestation,
  ConfigService,
  Credential,
  IAttestation,
  ICredentialPresentation,
  ISubmitCredential,
} from '@kiltprotocol/sdk-js';

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

import { getDidDocument, needLegacyDidCrypto } from '../../utilities/did/did';

async function getCompatibleContent(
  presentation: ICredentialPresentation,
  attestation: IAttestation,
  specVersion: ShareInput['specVersion'],
): Promise<ISubmitCredential['content']> {
  if (specVersion !== '1.0') {
    return [presentation];
  }

  const legacy = {
    request: presentation,
    attestation,
  } as unknown as ICredentialPresentation;
  return [legacy];
}

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

  const { credentialRequest, verifierDid, specVersion } = popupData;

  const { challenge } = credentialRequest;

  const { sporranCredential, identity, sharedContents } = selected;

  const [error, setError] = useState<string>();

  const passwordField = usePasswordField();

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      const { seed } = await passwordField.get(event);

      const isLegacy = await needLegacyDidCrypto(identity.did);
      const { encrypt, sign } = await getIdentityCryptoFromSeed(seed, isLegacy);

      const { rootHash } = sporranCredential.credential;
      const api = ConfigService.get('api');
      const result = await api.query.attestation.attestations(rootHash);
      if (result.isNone) {
        setError(t('view_ShareCredentialSign_error'));
        return;
      }
      const attestation = Attestation.fromChain(result, rootHash);

      const presentation = await Credential.createPresentation({
        credential: sporranCredential.credential,
        selectedAttributes: sharedContents,
        signCallback: sign,
        challenge,
      });

      const credentialsBody: ISubmitCredential = {
        content: await getCompatibleContent(
          presentation,
          attestation,
          specVersion,
        ),
        type: 'submit-credential',
      };

      const verifierDidDocument = await getDidDocument(verifierDid);

      const message = await encrypt(credentialsBody, verifierDidDocument);

      await shareChannel.return(message);
      window.close();
    },
    [
      sporranCredential,
      identity,
      passwordField,
      challenge,
      verifierDid,
      t,
      sharedContents,
      specVersion,
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
            <dd className={styles.detailValue}>{sporranCredential.name}</dd>
          </div>

          {sharedContents.map((sharedProp) => (
            <div key={sharedProp} className={styles.detail}>
              <dt className={styles.detailName}>{sharedProp}</dt>
              <dd className={styles.detailValue}>
                {String(
                  sporranCredential.credential.claim.contents[sharedProp],
                )}
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
        <button type="submit" className={styles.submit}>
          {t('view_ShareCredentialSign_CTA')}
        </button>

        <output className={styles.errorTooltip} hidden={!error}>
          {error}
        </output>
      </p>
    </form>
  );
}
