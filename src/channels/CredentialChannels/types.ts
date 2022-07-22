import { IEncryptedMessage } from '@kiltprotocol/types';

import { DAppName } from '../../channels/AccessChannels/DAppName';

export type CredentialInput = DAppName & {
  message: IEncryptedMessage;
};

export type CredentialOutput = IEncryptedMessage | void;
