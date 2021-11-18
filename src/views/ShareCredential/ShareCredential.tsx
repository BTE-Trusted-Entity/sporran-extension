import { browser } from 'webextension-polyfill-ts';
import { useCallback, useState } from 'react';
import { minBy } from 'lodash-es';
import { Attestation, RequestForAttestation } from '@kiltprotocol/core';
import { ISubmitCredential, MessageBodyType } from '@kiltprotocol/types';

import { shareChannel } from '../../channels/shareChannel/shareChannel';
import { IdentitySlide } from '../../components/IdentitySlide/IdentitySlide';
import {
  PasswordField,
  usePasswordField,
} from '../../components/PasswordField/PasswordField';
import {
  getIdentityCryptoFromKeypair,
  Identity,
  useIdentities,
} from '../../utilities/identities/identities';
import { getDidDetails } from '../../utilities/did/did';
import { useIdentityCredentials } from '../../utilities/credentials/credentials';
import { usePopupData } from '../../utilities/popups/usePopupData';
import { ShareInput } from '../../channels/shareChannel/types';

import * as tableStyles from '../../components/Table/Table.module.css';
import * as styles from './ShareCredential.module.css';

export function ShareCredential(): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const data = usePopupData<ShareInput>();

  const { credentialRequest, verifierDid } = data;

  const { cTypes, challenge } = credentialRequest;
  const cTypeHashes = cTypes.map(({ cTypeHash }) => cTypeHash);

  const credentials = useIdentityCredentials();
  const matchingCredentials = credentials?.filter((credential) =>
    cTypeHashes.includes(credential.request.claim.cTypeHash),
  );

  const [checked, setChecked] = useState<string>('0');

  const passwordField = usePasswordField();
  const [error, setError] = useState<string | null>(null);

  const handleShareToggle = useCallback(({ target }) => {
    setError(null);
    setChecked(target.name);
  }, []);

  const handleCancel = useCallback(async () => {
    await shareChannel.throw('Rejected');
    window.close();
  }, []);

  const identities = useIdentities().data;

  // The legacy design uses the first identity only, will be fixed with the new design
  const identity =
    identities && (minBy(Object.values(identities), 'index') as Identity);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      if (!matchingCredentials || !identity) {
        return;
      }

      const { keypair } = await passwordField.get(event);
      const { encrypt, keystore, didDetails } =
        await getIdentityCryptoFromKeypair(keypair);

      const request = RequestForAttestation.fromRequest(
        matchingCredentials[Number(checked)].request,
      );
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

      const verifierDidDetails = await getDidDetails(verifierDid);
      const message = await encrypt(credentialsBody, verifierDidDetails);

      await shareChannel.return(message);
      window.close();
    },
    [
      matchingCredentials,
      identity,
      passwordField,
      checked,
      challenge,
      verifierDid,
      t,
    ],
  );

  if (!credentials || !matchingCredentials || !identities || !identity) {
    return null; // storage data pending
  }

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <h1 className={styles.heading}>{t('view_ShareCredential_heading')}</h1>
      <p className={styles.subline}>{t('view_ShareCredential_subline')}</p>

      <IdentitySlide identity={identity} />

      <table className={styles.credentials}>
        <thead>
          <tr className={tableStyles.tr}>
            <th className={tableStyles.th} />
            <th className={tableStyles.th}>{t('view_ShareCredential_name')}</th>
            <th className={tableStyles.th}>
              {t('view_ShareCredential_ctype')}
            </th>
            <th className={tableStyles.th}>
              {t('view_ShareCredential_attester')}
            </th>
            <th className={tableStyles.th}>
              {t('view_ShareCredential_valid')}
            </th>
          </tr>
        </thead>
        <tbody>
          {matchingCredentials.map((credential, index) => (
            <tr key={credential.name} className={tableStyles.tr}>
              <td className={tableStyles.td}>
                <label>
                  <input
                    type="radio"
                    name={String(index)}
                    checked={Number(checked) === index}
                    onChange={handleShareToggle}
                    className={styles.checkbox}
                    aria-label={t('view_ShareCredential_share')}
                  />
                  <span />
                </label>
              </td>
              <td className={tableStyles.td}>{credential.name}</td>
              <td className={tableStyles.td}>{credential.cTypeTitle}</td>
              <td className={tableStyles.td}>{credential.attester}</td>
              <td
                className={
                  credential.status === 'attested'
                    ? styles.valid
                    : tableStyles.td
                }
                aria-label={
                  credential.status === 'attested'
                    ? t('view_ShareCredential_valid')
                    : undefined
                }
              />
            </tr>
          ))}
        </tbody>
      </table>

      <PasswordField identity={identity} password={passwordField} />

      <p className={styles.buttonsLine}>
        <button type="button" className={styles.cancel} onClick={handleCancel}>
          {t('common_action_cancel')}
        </button>
        <button
          type="submit"
          className={styles.submit}
          disabled={passwordField.isEmpty}
        >
          {t('view_ShareCredential_CTA')}
        </button>
        <output className={styles.errorTooltip} hidden={!error}>
          {error}
        </output>
      </p>
    </form>
  );
}
