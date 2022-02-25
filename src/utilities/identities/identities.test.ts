import {
  blake2AsU8a,
  cryptoWaitReady,
  mnemonicToMiniSecret,
  naclBoxPairFromSecret,
} from '@polkadot/util-crypto';
// eslint-disable-next-line import/no-extraneous-dependencies
import ed2curve from 'ed2curve';

import {
  deriveEncryptionKeyFromSeed,
  getKeypairByBackupPhrase,
} from './identities';

describe('identities', () => {
  describe('deriveEncryptionKeyFromSeed', () => {
    it('should return the same result as the old approach', async () => {
      // This test is safe to remove in the future if APIs or dependencies change

      await cryptoWaitReady();

      const backupPhrase =
        'shed loop ability atom senior peasant fame narrow sand same record electric';

      const oldBaseKeypair = getKeypairByBackupPhrase(backupPhrase);
      const oldDerivedKeypair = oldBaseKeypair.derive('//did//keyAgreement//0');
      let oldSecretKey = new Uint8Array();
      ed2curve.convertSecretKey = (key: Uint8Array) => {
        oldSecretKey = key;
        throw new Error();
      };
      try {
        oldDerivedKeypair.encryptMessage('', '');
      } catch {}
      const oldKeypair = naclBoxPairFromSecret(blake2AsU8a(oldSecretKey));

      const seed = mnemonicToMiniSecret(backupPhrase);
      const newKeypair = deriveEncryptionKeyFromSeed(seed);

      expect(newKeypair.publicKey).toEqual(oldKeypair.publicKey);
      expect(newKeypair.secretKey).toEqual(oldKeypair.secretKey);
    });
  });
});
