import { Fragment, useCallback } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { find, filter } from 'lodash-es';
import BN from 'bn.js';
import { RequestForAttestation, Credential } from '@kiltprotocol/core';
import {
  IDidDetails,
  ITerms,
  IClaim,
  IRequestAttestation,
  MessageBodyType,
} from '@kiltprotocol/types';

import * as styles from './SignQuote.module.css';

import {
  getIdentityCryptoFromKeypair,
  Identity,
} from '../../utilities/identities/identities';
import { saveCTypeTitle } from '../../utilities/cTypes/cTypes';
import {
  saveCredential,
  useIdentityCredentials,
} from '../../utilities/credentials/credentials';
import { usePopupData } from '../../utilities/popups/usePopupData';
import { getDidDetails } from '../../utilities/did/did';
import {
  PasswordField,
  usePasswordField,
} from '../../components/PasswordField/PasswordField';
import { claimChannel } from '../../channels/claimChannel/claimChannel';
import { KiltAmount } from '../../components/KiltAmount/KiltAmount';
import { IdentitiesCarousel } from '../../components/IdentitiesCarousel/IdentitiesCarousel';

export type Terms = ITerms & {
  claim: IClaim;
  attesterName: string;
  attesterDid: IDidDetails['did'];
};

interface Props {
  identity: Identity;
}

export function SignQuote({ identity }: Props): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const data = usePopupData<Terms>();

  const { claim, cTypes, quote, attesterName } = data;

  const cType = find(cTypes, { hash: claim.cTypeHash });

  const gross = quote?.cost?.gross;
  const costs = gross ? new BN(`${gross}000000000000000`) : new BN(0);

  const passwordField = usePasswordField();

  const handleCancel = useCallback(async () => {
    await claimChannel.throw('Rejected');
    window.close();
  }, []);

  const credentials = useIdentityCredentials(identity.did);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      if (!credentials || !cType) {
        return;
      }

      const { claim, delegationId, attesterName, attesterDid, legitimations } =
        data;

      const cTypeTitle = cType.schema.title;

      await saveCTypeTitle(claim.cTypeHash, cTypeTitle);

      const attestedClaims = legitimations.map((legitimation) =>
        Credential.fromCredential(legitimation),
      );

      const { keypair } = await passwordField.get(event);
      const { didDetails, keystore, encrypt } =
        await getIdentityCryptoFromKeypair(keypair);

      // The attester generated claim with the temporary identity, need to put real address in it
      const identityClaim = { ...claim, owner: didDetails.did };

      const requestForAttestation = RequestForAttestation.fromClaim(
        identityClaim,
        {
          legitimations: attestedClaims,
          ...(delegationId && { delegationId }),
        },
      );

      await requestForAttestation.signWithDid(keystore, didDetails);

      const matchingCredentials = filter(credentials, { cTypeTitle });
      const index = matchingCredentials.length + 1;
      const name = `${cTypeTitle} ${index}`;

      await saveCredential({
        request: requestForAttestation,
        name,
        cTypeTitle,
        attester: attesterName,
        status: 'pending',
      });

      const requestForAttestationBody: IRequestAttestation = {
        content: { requestForAttestation },
        type: MessageBodyType.REQUEST_ATTESTATION,
      };

      const attesterDidDetails = await getDidDetails(attesterDid);
      const message = await encrypt(
        requestForAttestationBody,
        attesterDidDetails,
      );

      await claimChannel.return(message);
      window.close();
    },
    [cType, data, passwordField, credentials],
  );

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.container}
      autoComplete="off"
    >
      <h1 className={styles.heading}>{t('view_SignQuote_heading')}</h1>
      <p className={styles.subline}>{t('view_SignQuote_subline')}</p>

      <IdentitiesCarousel identity={identity} />

      <p className={styles.costs}>
        <span>{t('view_SignQuote_costs')}</span>
        <KiltAmount amount={costs} type="costs" smallDecimals />
      </p>

      <dl className={styles.details}>
        {Object.entries(claim.contents).map(([name, value]) => (
          <Fragment key={name}>
            <dt className={styles.detailName}>{name}:</dt>
            <dd className={styles.detailValue}>{value}</dd>
          </Fragment>
        ))}
        <dt className={styles.detailName}>{t('view_SignQuote_cType')}:</dt>
        <dd className={styles.detailValue}>{cType?.schema?.title}</dd>

        <dt className={styles.detailName}>{t('view_SignQuote_attester')}:</dt>
        <dd className={styles.detailValue}>{attesterName}</dd>
      </dl>

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
          {t('view_SignQuote_CTA')}
        </button>
      </p>
    </form>
  );
}
