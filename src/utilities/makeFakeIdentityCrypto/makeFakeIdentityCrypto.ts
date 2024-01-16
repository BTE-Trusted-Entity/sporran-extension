import { Crypto, Signers } from '@kiltprotocol/utils';

export async function makeFakeIdentityCrypto(fakeSeed = new Uint8Array(32)) {
  const keypair = Crypto.makeKeypairFromSeed(fakeSeed, 'sr25519');
  const signers = await Signers.getSignersForKeypair({
    keypair,
  });
  const { address } = keypair;
  return { keypair, address, signers, fakeSeed };
}
