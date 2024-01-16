import type { DidUrl } from '@kiltprotocol/types';

export interface ChallengeInput {
  dAppEncryptionKeyId: DidUrl;
  challenge: string;
}

export interface ChallengeOutput {
  encryptionKeyId: DidUrl;
  encryptedChallenge: string;
  nonce: string;
}
