import { IMessage, IPublicIdentity } from '@kiltprotocol/types';

export interface CredentialInput {
  message: IMessage;
  sporranIdentity: IPublicIdentity;
  dAppIdentity: IPublicIdentity;
  dAppName: string;
}

export type CredentialOutput = IMessage | void;
