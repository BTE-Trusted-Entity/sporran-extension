import { Crypto, Signers } from '@kiltprotocol/utils';

import {
  deriveAuthenticationKey,
  deriveEncryptionKeyFromSeed,
} from '../identities/identities';

export async function makeFakeIdentityCrypto(fakeSeed = new Uint8Array(32)) {
  const keypair = Crypto.makeKeypairFromSeed(fakeSeed, 'sr25519');
  const authenticationKey = deriveAuthenticationKey(fakeSeed);
  const encryptionKey = deriveEncryptionKeyFromSeed(fakeSeed);

  const signers = await Signers.getSignersForKeypair({
    keypair: authenticationKey,
    id: authenticationKey.address,
  });

  const { address } = keypair;
  return {
    keypair,
    address,
    signers,
    authenticationKey,
    encryptionKey,
  };
}
