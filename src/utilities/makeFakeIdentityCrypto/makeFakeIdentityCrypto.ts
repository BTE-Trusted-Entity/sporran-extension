import { Utils } from '@kiltprotocol/sdk-js';

import { makeSignExtrinsicCallback } from '../makeSignExtrinsicCallback/makeSignExtrinsicCallback';

export function makeFakeIdentityCrypto(fakeSeed = new Uint8Array(32)) {
  const keypair = Utils.Crypto.makeKeypairFromSeed(fakeSeed, 'sr25519');
  const sign = makeSignExtrinsicCallback(keypair);
  const { address } = keypair;
  return { keypair, address, sign, fakeSeed };
}
