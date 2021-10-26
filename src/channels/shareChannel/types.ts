import {
  IDidDetails,
  IEncryptedMessage,
  IRequestClaimsForCTypesContent,
} from '@kiltprotocol/types';

export type ShareInput = {
  acceptedCTypes: IRequestClaimsForCTypesContent[];
  verifierDid: IDidDetails['did'];
};

export type ShareOutput = IEncryptedMessage;
