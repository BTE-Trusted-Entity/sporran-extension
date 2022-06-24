import { ITerms, DidUri, IEncryptedMessage } from '@kiltprotocol/types';

export interface ClaimInput extends ITerms {
  attesterName: string;
  attesterDid: DidUri;
}

export type ClaimOutput = IEncryptedMessage;
