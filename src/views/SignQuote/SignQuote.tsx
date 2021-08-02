import { Fragment, useCallback, useState, useMemo } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { find, minBy, omit } from 'lodash-es';
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
import { IClaim, ITerms } from '@kiltprotocol/types';

export function SignQuote(): JSX.Element | null {
  const t = browser.i18n.getMessage;

  type Terms = ITerms & { claim: IClaim; attester: string };

  const { data } = useQuery();
  const parsedValues = JSON.parse(window.atob(data)) as Terms;

  const transformedValues = useMemo(() => {
    const { claim, cTypes, quote, delegationId, attester } = parsedValues;
    const cType = find(cTypes, { hash: claim.cTypeHash });

    return {
      ...Object.fromEntries(Object.entries(claim.contents)),
      ...(cType
        ? { 'Credential type': cType.schema.title }
        : { 'Credential type': 'Not found' }),
      ...(quote && { total: quote.cost.gross }),
      claim,
      legitimations: [],
      delegationId,
      attester,
    };
  }, [parsedValues]);

  const costs = new BN(`${transformedValues.total}000000000000000`);

  const values = Object.entries(
    omit(transformedValues, [
      'total',
      'claim',
      'delegationId',
      'legitimations',
    ]),
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

      const claim = new Claim(transformedValues.claim);

      const cTypeTitle = transformedValues['Credential type'];
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
          legitimations: transformedValues.legitimations,
          ...(transformedValues.delegationId && {
            delegationId: transformedValues.delegationId,
          }),
        },
      );

      await saveCredential({
        request: requestForAttestation,
        name,
        cTypeTitle,
        attester: transformedValues['attester'],
        isAttested: false,
      });

      await backgroundClaimChannel.return(requestForAttestation);
      window.close();
    },
    [transformedValues, firstIdentity, name, passwordField],
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
