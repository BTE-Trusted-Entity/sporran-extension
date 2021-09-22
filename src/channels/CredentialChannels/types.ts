import { IEncryptedMessage } from '@kiltprotocol/types';

export interface CredentialInput {
  message: IEncryptedMessage;
  dAppName: string;
}

export type CredentialOutput = IEncryptedMessage | void;
