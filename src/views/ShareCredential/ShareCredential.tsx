import { browser } from 'webextension-polyfill-ts';
import { useCallback, useState } from 'react';
import { minBy } from 'lodash-es';
import { IAttestedClaim } from '@kiltprotocol/types';
import { Attestation, AttestedClaim } from '@kiltprotocol/core';

import { contentShareChannel } from '../../channels/ShareChannels/browserShareChannels';
import { IdentitySlide } from '../../components/IdentitySlide/IdentitySlide';
import { usePasswordType } from '../../components/usePasswordType/usePasswordType';
import { Identity, useIdentities } from '../../utilities/identities/identities';
import { useIdentityCredentials } from '../../utilities/credentials/credentials';
import { useQuery } from '../../utilities/useQuery/useQuery';

import tableStyles from '../../components/Table/Table.module.css';
import styles from './ShareCredential.module.css';

export function ShareCredential(): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const { cTypeHashes } = useQuery();
  const cTypes = JSON.parse(cTypeHashes);

  const credentials = useIdentityCredentials();
  const matchingCredentials = credentials?.filter((credential) =>
    cTypes.includes(credential.request.claim.cTypeHash),
  );

  const [checked, setChecked] = useState<{ [key: string]: boolean }>({
    '0': true,
  });

  const { passwordType, passwordToggle } = usePasswordType();
  const [password, setPassword] = useState('');

  const handleShareToggle = useCallback(
    ({ target }) => {
      setChecked({
        ...checked,
        [target.name]: target.checked,
      });
    },
    [checked],
  );

  const handleShareAllToggle = useCallback(({ target }) => {
    const newChecked: { [key: string]: boolean } = {};

    const { elements } = target.form;
    [...elements].forEach((input: HTMLInputElement) => {
      if (input.type === 'checkbox' && input !== elements.all) {
        newChecked[input.name] = elements.all.checked;
      }
    });

    setChecked(newChecked);
  }, []);

  const handlePasswordInput = useCallback((event) => {
    setPassword(event.target.value);
  }, []);

  const handleCancel = useCallback(async () => {
    await contentShareChannel.throw('Rejected');
    window.close();
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      if (!matchingCredentials) {
        return;
      }

      const requests = Object.entries(checked)
        .filter(([, value]) => value)
        .map(([index]) => matchingCredentials[Number(index)].request);

      const attestedClaims: IAttestedClaim[] = [];
      for (const request of requests) {
        const attestation = await Attestation.query(request.rootHash);
        if (!attestation) {
          continue;
        }
        attestedClaims.push(
          AttestedClaim.fromRequestAndAttestation(request, attestation),
        );
      }

      await contentShareChannel.return(attestedClaims);
      window.close();
    },
    [matchingCredentials, checked],
  );

  const identities = useIdentities().data;
  if (!credentials || !matchingCredentials || !identities) {
    return null; // storage data pending
  }

  // The legacy design uses the first identity only, will be fixed with the new design
  const identity = minBy(Object.values(identities), 'index') as Identity;

  const allChecked = credentials.every((dummy, index) => checked[index]);

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <h1 className={styles.heading}>{t('view_ShareCredential_heading')}</h1>
      <p className={styles.subline}>{t('view_ShareCredential_subline')}</p>

      <IdentitySlide identity={identity} />

      <table className={styles.credentials}>
        <thead>
          <tr className={tableStyles.tr}>
            <th className={tableStyles.th}>
              <label>
                <input
                  type="checkbox"
                  name="all"
                  checked={allChecked}
                  onChange={handleShareAllToggle}
                  className={styles.checkbox}
                />
                <span />
                {t('view_ShareCredential_all')}
              </label>
            </th>
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
                    type="checkbox"
                    name={String(index)}
                    checked={Boolean(checked[index])}
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
                  credential.isAttested ? styles.valid : tableStyles.td
                }
                aria-label={
                  credential.isAttested
                    ? t('view_ShareCredential_valid')
                    : undefined
                }
              />
            </tr>
          ))}
        </tbody>
      </table>

      <label className={styles.label}>
        {t('view_ShareCredential_password')}
        <span className={styles.passwordLine}>
          <input
            name="password"
            type={passwordType}
            className={styles.password}
            required
            onInput={handlePasswordInput}
          />
          {passwordToggle}
        </span>
      </label>

      <p className={styles.buttonsLine}>
        <button type="button" className={styles.cancel} onClick={handleCancel}>
          {t('common_action_cancel')}
        </button>
        <button type="submit" className={styles.submit} disabled={!password}>
          {t('view_ShareCredential_CTA')}
        </button>
      </p>
    </form>
  );
}
