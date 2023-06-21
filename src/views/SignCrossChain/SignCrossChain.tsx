import { FormEvent, Fragment, JSX, useCallback } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { ConfigService, Did, Utils } from '@kiltprotocol/sdk-js';

import * as styles from './SignCrossChain.module.css';

import { Identity } from '../../utilities/identities/types';
import { usePopupData } from '../../utilities/popups/usePopupData';
import { getIdentityCryptoFromSeed } from '../../utilities/identities/identities';
import { isFullDid } from '../../utilities/did/did';
import { useWeb3Name } from '../../utilities/useWeb3Name/useWeb3Name';
import { IdentitiesCarousel } from '../../components/IdentitiesCarousel/IdentitiesCarousel';
import { IdentitySlide } from '../../components/IdentitySlide/IdentitySlide';
import {
  PasswordField,
  usePasswordField,
} from '../../components/PasswordField/PasswordField';
import { backgroundSignCrossChainChannel } from '../../channels/SignCrossChainChannels/backgroundSignCrossChainChannel';
import { SignCrossChainOriginInput } from '../../channels/SignCrossChainChannels/types';

interface Props {
  identity: Identity;
}

export function SignCrossChain({ identity }: Props): JSX.Element | null {
  const t = browser.i18n.getMessage;

  const { did } = identity;
  const web3Name = useWeb3Name(did);

  const data = usePopupData<SignCrossChainOriginInput>();

  const { didUri, values, plaintext, blockNumber } = data;

  const error = [
    !did && t('view_SignCrossChain_error_unusable_did'),
    !isFullDid(did) && t('view_SignCrossChain_error_light_did'),
    !web3Name && t('view_SignCrossChain_error_web3name'),
  ].filter(Boolean)[0];

  const passwordField = usePasswordField();

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      if (!did) {
        throw new Error('DID is deleted and unusable');
      }

      const api = ConfigService.get('api');
      const didChain = Did.toChain(did);
      const { document, accounts } = Did.linkedInfoFromChain(
        await api.call.did.query(didChain),
      );

      const { seed } = await passwordField.get(event);
      const { authenticationKey } = await getIdentityCryptoFromSeed(seed);

      const request = api.createType('DipProofRequest', {
        identifier: didChain,
        keys: [Did.resourceIdToChain(document.authentication[0].id)],
        accounts,
        shouldIncludeWeb3Name: true,
      });
      const proofChain = await api.call.dipProvider.generateProof(request);
      // @ts-ignore
      const proof = proofChain.asOk.proof.toJSON();

      const signature = Utils.Crypto.u8aToHex(
        authenticationKey.sign(plaintext),
      );
      const signed = JSON.stringify([
        proof,
        [{ sr25519: signature }, blockNumber],
      ]);

      await backgroundSignCrossChainChannel.return({ signed });

      window.close();
    },
    [did, passwordField, plaintext, blockNumber],
  );

  const handleCancelClick = useCallback(async () => {
    await backgroundSignCrossChainChannel.throw('Rejected');
    window.close();
  }, []);

  const identityIsPredetermined = did && did === didUri;
  const IdentityChoice = identityIsPredetermined
    ? IdentitySlide
    : IdentitiesCarousel;

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <h1 className={styles.heading}>{t('view_SignCrossChain_title')}</h1>
      <p className={styles.subline}>{t('view_SignCrossChain_subline')}</p>

      <IdentityChoice identity={identity} />

      <dl className={styles.details}>
        {values.map(({ label, value, details }) => (
          <Fragment key={label}>
            <dt className={styles.detailName}>{label}:</dt>
            <dd
              className={styles.detailValue}
              title={!details ? String(value) : undefined}
            >
              {!details ? (
                value
              ) : (
                <details className={styles.expanded}>
                  <summary>{value}</summary>
                  {details}
                </details>
              )}
            </dd>
          </Fragment>
        ))}
      </dl>

      <PasswordField identity={identity} autoFocus password={passwordField} />

      <p className={styles.buttonsLine}>
        <button
          onClick={handleCancelClick}
          type="button"
          className={styles.reject}
        >
          {t('view_SignCrossChain_reject')}
        </button>
        <button
          type="submit"
          className={styles.submit}
          disabled={Boolean(error)}
        >
          {t('common_action_sign')}
        </button>
        <output className={styles.errorTooltip} hidden={!error}>
          {error}
        </output>
      </p>
    </form>
  );
}
