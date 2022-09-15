import { Runtime } from 'webextension-polyfill-ts';
import { naclSeal } from '@polkadot/util-crypto';
import { Crypto } from '@kiltprotocol/utils';

import { getTabEncryption } from '../../utilities/getTabEncryption/getTabEncryption';

import { ChallengeInput, ChallengeOutput } from './types';
import { initKiltSDK } from '../../utilities/initKiltSDK/initKiltSDK';

export async function produceEncryptedChallenge(
  input: ChallengeInput,
  sender: Runtime.MessageSender,
): Promise<ChallengeOutput> {
  const { challenge, dAppEncryptionKeyId } = input;

  await initKiltSDK();

  const encryption = await getTabEncryption(sender, dAppEncryptionKeyId);

  const { dAppEncryptionDidKey, sporranEncryptionDidKeyUri } = encryption;

  const { sealed, nonce } = naclSeal(
    Crypto.coToUInt8(challenge),
    encryption.encryptionKey.secretKey,
    dAppEncryptionDidKey.publicKey,
  );

  return {
    encryptionKeyId: sporranEncryptionDidKeyUri,
    encryptedChallenge: Crypto.u8aToHex(sealed),
    nonce: Crypto.u8aToHex(nonce),
  };
}
