import { DidPublicKey } from '@kiltprotocol/types';

export interface ChallengeInput {
  dAppEncryptionKeyId: DidPublicKey['id'];
  challenge: string;
}

export interface ChallengeOutput {
  encryptionKeyId: DidPublicKey['id'];
  encryptedChallenge: string;
  nonce: string;
}
