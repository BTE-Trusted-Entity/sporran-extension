import { BlockchainApiConnection } from '@kiltprotocol/chain-helpers';

import { FullDidCreationBuilder } from '@kiltprotocol/did';

import { HexString } from '@polkadot/util/types';

import {
  getKeystoreFromSeed,
  getLightDidFromSeed,
} from '../identities/identities';
import { getDidEncryptionKey, parseDidUri } from '../did/did';

export interface CreationDetails {
  creationDetails: HexString;
  signature: HexString;
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
