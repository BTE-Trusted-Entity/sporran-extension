import { FormEvent, Fragment, useCallback } from 'react';
import browser from 'webextension-polyfill';
import { filter, find } from 'lodash-es';
import {
  BalanceUtils,
  Credential,
  CType,
  DidUri,
  IClaim,
  ICredential,
  ICType,
  IRequestAttestation,
  IRequestAttestationContent,
  ITerms,
  SignCallback,
} from '@kiltprotocol/sdk-js';

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
import { KiltAmount } from '../../components/KiltAmount/KiltAmount';
import { IdentitiesCarousel } from '../../components/IdentitiesCarousel/IdentitiesCarousel';
import { useIsOnChainDidDeleted } from '../../utilities/did/useIsOnChainDidDeleted';
import { IdentitySlide } from '../../components/IdentitySlide/IdentitySlide';

export type Terms = ITerms & {
  claim: IClaim;
  attesterName: string;
  attesterDid: DidUri;
  specVersion: '1.0' | '3.0';
};

async function getCompatibleContent(
  credential: ICredential,
  signCallback: SignCallback,
  specVersion: Terms['specVersion'],
): Promise<IRequestAttestationContent> {
  if (specVersion !== '1.0') {
    return { credential };
  }

  // DApps using legacy spec versions will expect a different interface for the message including the claimerSignature property
  const requestForAttestation = await Credential.createPresentation({
    credential,
    signCallback,
  });
  return {
    requestForAttestation,
  } as unknown as IRequestAttestationContent;
}

interface Props {
  identity: Identity;
}

export function SignQuote({ identity }: Props) {
  const t = browser.i18n.getMessage;

  const data = usePopupData<Terms>();

  const { did } = identity;
  const error = useIsOnChainDidDeleted(did);

  const { claim, cTypes, quote, attesterName, specVersion } = data;

  const $id = CType.hashToId(claim.cTypeHash);
  const cType = find(cTypes, { $id }) as ICType | undefined;

  const gross = quote?.cost?.gross;
  const costs = BalanceUtils.toFemtoKilt(gross || 0);

  const passwordField = usePasswordField();

  const handleCancel = useCallback(async () => {
    await claimChannel.throw('Rejected');
    window.close();
  }, []);

  const sporranCredentials = useIdentityCredentials(did);

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      if (!sporranCredentials || !cType) {
        return;
      }

      const { claim, delegationId, attesterName, attesterDid, legitimations } =
        data;

      const cTypeTitle = cType.title;

      legitimations.forEach((legitimation) =>
        Credential.verifyDataStructure(legitimation),
      );

      const { seed } = await passwordField.get(event);
      const { sign, encrypt, didDocument } =
        await getIdentityCryptoFromSeed(seed);

      // if a legacy attester generated a claim with a temporary DID, we need to replace it with the real one
      const identityClaim = { ...claim, owner: didDocument.uri };

      const credential = Credential.fromClaim(identityClaim, {
        legitimations,
        ...(delegationId && { delegationId }),
      });

      const matchingCredentials = filter(sporranCredentials, { cTypeTitle });
      const index = matchingCredentials.length + 1;
      const name = `${cTypeTitle} ${index}`;

      await saveCredential({
        credential,
        name,
        cTypeTitle,
        attester: attesterName,
        status: 'pending',
      });

      const messageBody: IRequestAttestation = {
        content: await getCompatibleContent(credential, sign, specVersion),
        type: 'request-attestation',
      };

      const attesterDidDocument = await getDidDocument(attesterDid);
      const message = await encrypt(messageBody, attesterDidDocument);

      await claimChannel.return(message);
      window.close();
    },
    [sporranCredentials, cType, data, passwordField, specVersion],
  );

  const identityIsPredetermined = did && did === claim.owner;

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.container}
      autoComplete="off"
    >
      <h1 className={styles.heading}>{t('view_SignQuote_heading')}</h1>
      <p className={styles.subline}>
        {identityIsPredetermined
          ? t('view_SignQuote_subline_predetermined')
          : t('view_SignQuote_subline')}
      </p>

      {identityIsPredetermined ? (
        <IdentitySlide identity={identity} />
      ) : (
        <IdentitiesCarousel identity={identity} />
      )}

      <p className={styles.costs}>
        <span>{t('view_SignQuote_costs')}</span>
        <KiltAmount amount={costs} type="costs" smallDecimals />
      </p>

      <dl className={styles.details}>
        {Object.entries(claim.contents).map(([name, value]) => (
          <Fragment key={name}>
            <dt className={styles.detailName}>{name}:</dt>
            <dd className={styles.detailValue}>{String(value)}</dd>
          </Fragment>
        ))}
        <dt className={styles.detailName}>{t('view_SignQuote_cType')}:</dt>
        <dd className={styles.detailValue}>{cType?.title}</dd>

        <dt className={styles.detailName}>{t('view_SignQuote_attester')}:</dt>
        <dd className={styles.detailValue}>{attesterName}</dd>
      </dl>

      <PasswordField identity={identity} password={passwordField} />

      <p className={styles.buttonsLine}>
        <button type="button" className={styles.cancel} onClick={handleCancel}>
          {t('common_action_cancel')}
        </button>
        <button type="submit" className={styles.submit} disabled={error}>
          {t('view_SignQuote_CTA')}
        </button>
        <output className={styles.errorTooltip} hidden={did && !error}>
          {t('view_SignQuote_on_chain_did_deleted')}
        </output>
      </p>
    </form>
  );
}
