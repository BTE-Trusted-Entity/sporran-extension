import { Runtime } from 'webextension-polyfill';

import { Crypto } from '@kiltprotocol/utils';
import { multibaseKeyToDidKey } from '@kiltprotocol/did';

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

  const { keyType, publicKey } = multibaseKeyToDidKey(
    dAppEncryptionDidKey.publicKeyMultibase,
  );
  if (keyType !== 'x25519') {
    throw new Error(
      `key type ${keyType} is not suitable for x25519 key agreement`,
    );
  }

  const { nonce, box } = Crypto.encryptAsymmetricAsStr(
    Crypto.coToUInt8(challenge),
    publicKey,
    encryption.encryptionKey.secretKey,
  );

  return {
    encryptionKeyId: sporranEncryptionDidKeyUri,
    encryptedChallenge: box,
    nonce,
  };
}
