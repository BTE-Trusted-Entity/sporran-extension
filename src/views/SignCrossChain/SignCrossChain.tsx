import { FormEvent, Fragment, JSX, useCallback } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { ConfigService, Did, Utils } from '@kiltprotocol/sdk-js';

import { ApiPromise, WsProvider } from '@polkadot/api';

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
      const dipProof = (await api.call.dipProvider.generateProof(request)).asOk;
      console.log(`DIP proof generated: ${dipProof.toHuman()}`);

      // Taken from kilt-did-utils
      const providerChainId = await api.query.parachainInfo.parachainId();
      console.log(`Provider chain has para ID = ${providerChainId.toHuman()}.`);
      const providerFinalizedBlockHash = await api.rpc.chain.getFinalizedHead();
      const providerFinalizedBlockNumber = await api.rpc.chain
        .getHeader(providerFinalizedBlockHash)
        .then((h: any) => h.number);
      console.log(
        `DIP action targeting the last finalized identity provider block with hash:
          ${providerFinalizedBlockHash}
          and number
          ${providerFinalizedBlockNumber}.`,
      );
      const relayParentBlockHeight = await api
        .at(providerFinalizedBlockHash)
        .then((api: any) =>
          api.query.parachainSystem.lastRelayChainBlockNumber(),
        );
      const relayApi = await ApiPromise.create({
        provider: new WsProvider('ws://127.0.0.1:50001'),
      });
      const relayParentBlockHash = await relayApi.rpc.chain.getBlockHash(
        relayParentBlockHeight,
      );
      console.log(
        `Relay chain block the identity provider block was anchored to:
    ${relayParentBlockHeight.toHuman()}
    with hash
    ${relayParentBlockHash.toHuman()}.`,
      );

      const { proof: relayProof } = await relayApi.rpc.state.getReadProof(
        [relayApi.query.paras.heads.key(providerChainId)],
        relayParentBlockHash,
      );

      const header = await relayApi.rpc.chain.getHeader(relayParentBlockHash);
      console.log(
        `Header for the relay at block ${relayParentBlockHeight} (${relayParentBlockHash}): ${JSON.stringify(
          header,
          null,
          2,
        )}`,
      );

      // Proof of commitment must be generated with the state root at the block before the last one finalized.
      const previousBlockHash = await api.rpc.chain.getBlockHash(
        providerFinalizedBlockNumber.toNumber() - 1,
      );
      console.log(
        `Using previous provider block hash for the state proof generation: ${previousBlockHash.toHex()}.`,
      );
      const { proof: paraStateProof } = await api.rpc.state.getReadProof(
        [api.query.dipProvider.identityCommitments.key(Did.toChain(did))],
        previousBlockHash,
      );
      console.log(
        `DIP proof generated for the DID key ${document.authentication[0].id.substring(
          1,
        )}.`,
      );

      const signature = Utils.Crypto.u8aToHex(
        authenticationKey.sign(plaintext),
      );
      // @ts-ignore
      const proof = {
        paraStateRoot: {
          relayBlockHeight: relayParentBlockHeight,
          proof: relayProof,
        },
        relayHeader: {
          ...header.toJSON(),
        },
        dipIdentityCommitment: paraStateProof,
        did: {
          leaves: {
            blinded: dipProof.proof.blinded,
            revealed: dipProof.proof.revealed,
          },
          signature: {
            signature: {
              sr25519: signature,
            },
            blockNumber,
          },
        },
      };
      console.log('Proof: ', JSON.stringify(proof, null, 2));
      // const signed = JSON.stringify([
      //   proof,
      //   [{ sr25519: signature }, blockNumber],
      // ]);
      // console.log('Signed: ', JSON.stringify(proof, null, 2));

      await backgroundSignCrossChainChannel.return({
        signed: JSON.stringify(proof),
      });

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
