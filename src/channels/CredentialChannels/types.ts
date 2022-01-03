import { IEncryptedMessage } from '@kiltprotocol/types';

import { DAppName } from '../../dApps/AccessChannels/DAppName';

export type CredentialInput = DAppName & {
  message: IEncryptedMessage;
};

export type CredentialOutput = IEncryptedMessage | void;
