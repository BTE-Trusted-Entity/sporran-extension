import { BlockchainApiConnection } from '@kiltprotocol/chain-helpers';

import { FullDidCreationBuilder } from '@kiltprotocol/did';

import ky from 'ky';

import {
  getKeystoreFromSeed,
  getLightDidFromSeed,
} from '../identities/identities';
import { getDidEncryptionKey, parseDidUri } from '../did/did';
import { backendEndpoints } from '../endpoints/endpoints';

export async function getPromoStatus(): Promise<{
  account: string;
  remaining_dids: number;
  is_active: boolean;
}> {
  return await ky.get(backendEndpoints.promoStatus).json();
}

interface CreationDetails {
  creationDetails: string;
  signature: string;
  did: string;
}

export async function getDidCreationDetails(
  seed: Uint8Array,
  submitter: string,
): Promise<CreationDetails> {
  const keystore = await getKeystoreFromSeed(seed);

  const lightDidDetails = getLightDidFromSeed(seed);
  const { fullDid: did } = parseDidUri(lightDidDetails.did);

  const blockchain = await BlockchainApiConnection.getConnectionOrConnect();
  const encryptionKey = getDidEncryptionKey(lightDidDetails);

  const extrinsic = await new FullDidCreationBuilder(
    blockchain.api,
    lightDidDetails.authenticationKey,
  )
    .addEncryptionKey(encryptionKey)
    .consume(keystore, submitter);

  return {
    creationDetails: extrinsic.args[0].toHex(),
    signature: extrinsic.args[1].toHex(),
    did,
  };
}

export async function createDid(
  input: Omit<CreationDetails, 'did'>,
): Promise<{ tx_hash: string }> {
  return ky.post(backendEndpoints.createDid, { json: input }).json();
}

export async function waitFinalized(txHash: string): Promise<boolean> {
  return ky
    .get(`${backendEndpoints.waitFinalized}?tx_hash=${txHash}`, {
      timeout: false,
    })
    .json();
}
