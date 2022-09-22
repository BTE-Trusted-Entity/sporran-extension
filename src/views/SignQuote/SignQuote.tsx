import { FormEvent, Fragment, useCallback } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { filter, find } from 'lodash-es';
import { Credential } from '@kiltprotocol/core';
import {
  IClaim,
  DidUri,
  IRequestAttestation,
  ITerms,
} from '@kiltprotocol/types';

import * as styles from './SignQuote.module.css';

import {
  getIdentityCryptoFromSeed,
  Identity,
} from '../../utilities/identities/identities';
import {
  saveCredential,
  useIdentityCredentials,
} from '../../utilities/credentials/credentials';
import { usePopupData } from '../../utilities/popups/usePopupData';
import { getDidDocument } from '../../utilities/did/did';
import {
  PasswordField,
  usePasswordField,
} from '../../components/PasswordField/PasswordField';
import { claimChannel } from '../../channels/claimChannel/claimChannel';
import { IdentitiesCarousel } from '../../components/IdentitiesCarousel/IdentitiesCarousel';

export type Terms = ITerms & {
  claim: IClaim;
  attesterName: string;
  attesterDid: DidUri;
};

interface Props {
  identity: Identity;
}

export function SignQuote({ identity }: Props): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const data = usePopupData<Terms>();

  const { claim, cTypes, attesterName } = data;

  const cType = find(cTypes, { hash: claim.cTypeHash });

  const passwordField = usePasswordField();

  const handleCancel = useCallback(async () => {
    await claimChannel.throw('Rejected');
    window.close();
  }, []);

  const credentials = useIdentityCredentials(identity.did);

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      if (!credentials || !cType) {
        return;
      }

      const { claim, delegationId, attesterName, attesterDid, legitimations } =
        data;

      const cTypeTitle = cType.schema.title;

      legitimations.forEach((legitimation) =>
        Credential.verifyDataStructure(legitimation),
      );

      const { seed } = await passwordField.get(event);

      const { encryptMsg, didDocument } = await getIdentityCryptoFromSeed(seed);

      // The attester generated claim with the temporary identity, need to put real address in it
      const identityClaim = { ...claim, owner: didDocument.uri };

      const requestedCredential = Credential.fromClaim(identityClaim, {
        legitimations,
        ...(delegationId && { delegationId }),
      });

      const matchingCredentials = filter(credentials, { cTypeTitle });
      const index = matchingCredentials.length + 1;
      const name = `${cTypeTitle} ${index}`;

      await saveCredential({
        request: requestedCredential,
        name,
        cTypeTitle,
        attester: attesterName,
        status: 'pending',
      });

      const requestForAttestationBody: IRequestAttestation = {
        content: { credential: requestedCredential },
        type: 'request-attestation',
      };

      const attesterDidDocument = await getDidDocument(attesterDid);
      const message = await encryptMsg(
        requestForAttestationBody,
        attesterDidDocument,
      );

      await claimChannel.return(message);
      window.close();
    },
    [credentials, cType, data, passwordField],
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

      <dl className={styles.details}>
        {Object.entries(claim.contents).map(([name, value]) => (
          <Fragment key={name}>
            <dt className={styles.detailName}>{name}:</dt>
            <dd className={styles.detailValue}>{String(value)}</dd>
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
