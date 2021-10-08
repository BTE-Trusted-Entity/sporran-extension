import { ITerms, IDidDetails, IEncryptedMessage } from '@kiltprotocol/types';

export interface ClaimInput extends ITerms {
  attesterName: string;
  attesterDid: IDidDetails['did'];
}

export type ClaimOutput = IEncryptedMessage;
