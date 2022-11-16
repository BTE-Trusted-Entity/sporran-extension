import { ITerms, DidUri, IEncryptedMessage } from '@kiltprotocol/types';

export interface ClaimInput extends ITerms {
  attesterName: string;
  attesterDid: DidUri;
  specVersion: '1.0' | '3.0';
}

export type ClaimOutput = IEncryptedMessage;
