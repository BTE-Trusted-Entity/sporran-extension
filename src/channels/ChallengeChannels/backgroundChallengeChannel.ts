import { Runtime } from 'webextension-polyfill-ts';
import { randomAsU8a } from '@polkadot/util-crypto';
import { box } from 'tweetnacl';
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

  const nonce = randomAsU8a(24);
  const sealed = box(
    Utils.Crypto.coToUInt8(challenge),
    nonce,
    dAppEncryptionDidKey.publicKey,
    encryption.encryptionKey.secretKey,
  );

  return {
    encryptionKeyId: sporranEncryptionDidKeyUri,
    encryptedChallenge: Utils.Crypto.u8aToHex(sealed),
    nonce: Utils.Crypto.u8aToHex(nonce),
  };
}
