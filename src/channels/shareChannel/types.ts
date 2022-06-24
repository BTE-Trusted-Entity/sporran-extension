import {
  DidUri,
  IEncryptedMessage,
  IRequestCredentialContent,
} from '@kiltprotocol/types';

export type ShareInput = {
  credentialRequest: IRequestCredentialContent;
  verifierDid: DidUri;
};

export type ShareOutput = IEncryptedMessage;
