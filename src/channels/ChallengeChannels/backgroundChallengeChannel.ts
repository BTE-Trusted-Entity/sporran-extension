import { Runtime } from 'webextension-polyfill-ts';
import { naclSeal } from '@polkadot/util-crypto';
import { Crypto } from '@kiltprotocol/utils';

import { getTabEncryption } from '../../utilities/getTabEncryption/getTabEncryption';

import { contentChallengeChannel } from './contentChallengeChannel';
import { ChallengeInput, ChallengeOutput } from './types';

async function produceEncryptedChallenge(
  input: ChallengeInput,
  sender: Runtime.MessageSender,
): Promise<ChallengeOutput> {
  const { challenge, dAppEncryptionKeyId } = input;

  const encryption = await getTabEncryption(sender, dAppEncryptionKeyId);

  const { dAppEncryptionDidKey, sporranEncryptionDidKey } = encryption;

  const { sealed, nonce } = naclSeal(
    Crypto.coToUInt8(challenge),
    encryption.encryptionKey.secretKey,
    Crypto.coToUInt8(dAppEncryptionDidKey.publicKeyHex),
  );

  return {
    encryptionKeyId: sporranEncryptionDidKey.id,
    encryptedChallenge: Crypto.u8aToHex(sealed),
    nonce: Crypto.u8aToHex(nonce),
  };
}

export function backgroundChallengeChannel(): void {
  contentChallengeChannel.produce(produceEncryptedChallenge);
}
