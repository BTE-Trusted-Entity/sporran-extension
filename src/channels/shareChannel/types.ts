import {
  IDidDetails,
  IEncryptedMessage,
  IRequestCredentialContent,
} from '@kiltprotocol/types';

export type ShareInput = {
  credentialRequest: IRequestCredentialContent;
  verifierDid: IDidDetails['did'];
};

export type ShareOutput = IEncryptedMessage;
