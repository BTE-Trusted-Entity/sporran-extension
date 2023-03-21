import {
  DidUri,
  IEncryptedMessage,
  IRequestCredentialContent,
} from '@kiltprotocol/sdk-js';

export type ShareInput = {
  credentialRequest: IRequestCredentialContent;
  verifierDid: DidUri;
  specVersion: '1.0' | '3.0';
};

export type ShareOutput = IEncryptedMessage;
