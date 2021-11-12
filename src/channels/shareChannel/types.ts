import {
  IDidDetails,
  IEncryptedMessage,
  IRequestCredentialContent,
} from '@kiltprotocol/types';

export type ShareInput = {
  acceptedCTypes: IRequestCredentialContent;
  verifierDid: IDidDetails['did'];
};

export type ShareOutput = IEncryptedMessage;
