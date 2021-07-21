import { Fragment, useCallback, useState } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { minBy, omit } from 'lodash-es';
import BN from 'bn.js';
import { Claim, RequestForAttestation } from '@kiltprotocol/core';

import {
  decryptIdentity,
  Identity,
  useIdentities,
} from '../../utilities/identities/identities';
import { saveCTypeTitle } from '../../utilities/cTypes/cTypes';
import { saveCredential } from '../../utilities/credentials/credentials';
import {
  PasswordField,
  usePasswordField,
} from '../../components/PasswordField/PasswordField';
import { useQuery } from '../../utilities/useQuery/useQuery';
import { backgroundClaimChannel } from '../../channels/ClaimChannels/browserClaimChannels';
import { KiltAmount } from '../../components/KiltAmount/KiltAmount';
import { Avatar } from '../../components/Avatar/Avatar';

import styles from './SignQuote.module.css';

export function SignQuote(): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const allValues = useQuery();
  const costs = new BN(`${allValues.total}000000000000000`);
  const values = Object.entries(
    omit(allValues, ['total', 'claim', 'delegationId', 'legitimations']),
  );

  const [name, setName] = useState('');
  const passwordField = usePasswordField();

  const handleNameInput = useCallback((event) => {
    setName(event.target.value);
  }, []);

  const handleCancel = useCallback(async () => {
    await backgroundClaimChannel.throw('Rejected');
    window.close();
  }, []);

  const identities = useIdentities().data;
  const firstIdentity =
    identities && (minBy(Object.values(identities), 'index') as Identity);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      if (!firstIdentity) {
        return;
      }

      const claim = new Claim(JSON.parse(allValues.claim));

      const cTypeTitle = allValues['Credential type'];
      await saveCTypeTitle(claim.cTypeHash, cTypeTitle);

      const password = await passwordField.get(event);
      const sdkIdentity = await decryptIdentity(
        firstIdentity.address,
        password,
      );
      const requestForAttestation = RequestForAttestation.fromClaimAndIdentity(
        claim,
        sdkIdentity,
        {
          legitimations: JSON.parse(allValues.legitimations),
          ...(allValues.delegationId && {
            delegationId: JSON.parse(allValues.delegationId),
          }),
        },
      );

      await saveCredential({
        request: requestForAttestation,
        name,
        cTypeTitle,
        attester: allValues['Attester'],
        isAttested: false,
      });

      await backgroundClaimChannel.return(requestForAttestation);
      window.close();
    },
    [allValues, firstIdentity, name, passwordField],
  );

  if (!identities || !firstIdentity) {
    return null; // storage data pending
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.container}
      autoComplete="off"
    >
      <h1 className={styles.heading}>{t('view_SignQuote_heading')}</h1>

      <dl className={styles.details}>
        {values.map(([name, value]) => (
          <Fragment key={name}>
            <dt className={styles.detailName}>{name}:</dt>
            <dd className={styles.detailValue}>{value}</dd>
          </Fragment>
        ))}
      </dl>

      <p className={styles.costs}>
        <span>{t('view_SignQuote_costs')}</span>
        <KiltAmount amount={costs} type="costs" smallDecimals />
      </p>

      <label className={styles.label}>
        {t('view_SignQuote_name')}
        <input
          name="name"
          className={styles.name}
          required
          onInput={handleNameInput}
          autoComplete="off"
          autoFocus
        />
      </label>

      <div className={styles.identity}>
        <Avatar address={firstIdentity.address} className={styles.avatar} />
        <span className={styles.identityName}>{firstIdentity.name}</span>
      </div>

      <PasswordField identity={firstIdentity} password={passwordField} />

      <p className={styles.buttonsLine}>
        <button type="button" className={styles.cancel} onClick={handleCancel}>
          {t('common_action_cancel')}
        </button>
        <button
          type="submit"
          className={styles.submit}
          disabled={!name || passwordField.isEmpty}
        >
          {t('view_SignQuote_CTA')}
        </button>
      </p>
    </form>
  );
}
