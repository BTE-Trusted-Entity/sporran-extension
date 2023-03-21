import { Runtime } from 'webextension-polyfill-ts';
import { naclSeal } from '@polkadot/util-crypto';
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

  const { sealed, nonce } = naclSeal(
    Utils.Crypto.coToUInt8(challenge),
    encryption.encryptionKey.secretKey,
    dAppEncryptionDidKey.publicKey,
  );

  return {
    encryptionKeyId: sporranEncryptionDidKeyUri,
    encryptedChallenge: Utils.Crypto.u8aToHex(sealed),
    nonce: Utils.Crypto.u8aToHex(nonce),
  };
}
