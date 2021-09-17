import { Runtime } from 'webextension-polyfill-ts';
import { naclSeal } from '@polkadot/util-crypto';
import { KeyRelationship } from '@kiltprotocol/types';
import { Crypto } from '@kiltprotocol/utils';

import { getTabEncryption } from '../../utilities/getTabEncryption/getTabEncryption';
import { contentChallengeChannel } from './contentChallengeChannel';
import { ChallengeInput, ChallengeOutput } from './types';

async function produceEncryptedChallenge(
  input: ChallengeInput,
  sender: Runtime.MessageSender,
): Promise<ChallengeOutput> {
  const { challenge, dAppDid } = input;

  const encryption = await getTabEncryption(sender, dAppDid);

  const dAppEncryptionKey = encryption.dAppDidDetails
    .getKeys(KeyRelationship.keyAgreement)
    .pop();
  if (!dAppEncryptionKey) {
    throw new Error('Receiver key agreement key not found');
  }

  const { sealed, nonce } = naclSeal(
    Crypto.coToUInt8(challenge),
    encryption.encryptionKey.secretKey,
    Crypto.coToUInt8(dAppEncryptionKey.publicKeyHex),
  );

  return {
    sporranDid: encryption.sporranDidDetails.did,
    encryptedChallenge: Crypto.u8aToHex(sealed),
    nonce: Crypto.u8aToHex(nonce),
  };
}

export function backgroundChallengeChannel(): void {
  contentChallengeChannel.produce(produceEncryptedChallenge);
}
