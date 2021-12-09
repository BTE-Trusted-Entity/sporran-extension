import { IDidKeyDetails } from '@kiltprotocol/types';

export interface ChallengeInput {
  dAppEncryptionKeyId: IDidKeyDetails['id'];
  challenge: string;
}

export interface ChallengeOutput {
  encryptionKeyId: IDidKeyDetails['id'];
  encryptedChallenge: string;
  nonce: string;
}
