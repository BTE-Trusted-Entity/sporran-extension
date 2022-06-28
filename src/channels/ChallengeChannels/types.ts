import { DidResourceUri } from '@kiltprotocol/types';

export interface ChallengeInput {
  dAppEncryptionKeyId: DidResourceUri;
  challenge: string;
}

export interface ChallengeOutput {
  encryptionKeyId: DidResourceUri;
  encryptedChallenge: string;
  nonce: string;
}
