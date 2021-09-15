import { IMessage, IDidDetails } from '@kiltprotocol/types';

export interface CredentialInput {
  message: IMessage;
  sporranIdentity: IDidDetails['did'];
  dAppIdentity: IDidDetails['did'];
  dAppName: string;
}

export type CredentialOutput = IMessage | void;
