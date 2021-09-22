import { IDidDetails } from '@kiltprotocol/types';

export interface ChallengeInput {
  dAppDid: IDidDetails['did'];
  challenge: string;
}

export interface ChallengeOutput {
  sporranDid: IDidDetails['did'];
  encryptedChallenge: string;
  nonce: string;
}
