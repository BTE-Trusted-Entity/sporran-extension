import { DidPublicKey } from '@kiltprotocol/types';

export interface ChallengeInput {
  dAppEncryptionKeyId: DidPublicKey['uri'];
  challenge: string;
}

export interface ChallengeOutput {
  encryptionKeyId: DidPublicKey['uri'];
  encryptedChallenge: string;
  nonce: string;
}
