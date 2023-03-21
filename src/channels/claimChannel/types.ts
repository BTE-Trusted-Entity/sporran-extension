import { ITerms, DidUri, IEncryptedMessage } from '@kiltprotocol/sdk-js';

export interface ClaimInput extends ITerms {
  attesterName: string;
  attesterDid: DidUri;
  specVersion: '1.0' | '3.0';
}

export type ClaimOutput = IEncryptedMessage;
