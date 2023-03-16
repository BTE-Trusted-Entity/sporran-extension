import { Runtime } from 'webextension-polyfill';
import { Utils } from '@kiltprotocol/sdk-js';

import { getTabEncryption } from '../../utilities/getTabEncryption/getTabEncryption';

import { initKiltSDK } from '../../utilities/initKiltSDK/initKiltSDK';

import { ChallengeInput, ChallengeOutput } from './types';

export async function produceEncryptedChallenge(
  input: ChallengeInput,
  sender: Runtime.MessageSender,
): Promise<ChallengeOutput> {
  const { challenge, dAppEncryptionKeyId } = input;

  await initKiltSDK();

  const encryption = await getTabEncryption(sender, dAppEncryptionKeyId);

  const { dAppEncryptionDidKey, sporranEncryptionDidKeyUri } = encryption;

  const { nonce, box } = Utils.Crypto.encryptAsymmetricAsStr(
    Utils.Crypto.coToUInt8(challenge),
    dAppEncryptionDidKey.publicKey,
    encryption.encryptionKey.secretKey,
  );

  return {
    encryptionKeyId: sporranEncryptionDidKeyUri,
    encryptedChallenge: box,
    nonce,
  };
}
