import type { Did } from '@kiltprotocol/types';
import type {
  IEncryptedMessage,
  IRequestCredentialContent,
} from '@kiltprotocol/kilt-extension-api/types';

export type ShareInput = {
  credentialRequest: IRequestCredentialContent;
  verifierDid: Did;
  specVersion: '1.0' | '3.0';
};

export type ShareOutput = IEncryptedMessage;
