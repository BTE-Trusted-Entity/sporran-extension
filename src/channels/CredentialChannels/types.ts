import type { IEncryptedMessage } from '@kiltprotocol/kilt-extension-api/types';

import { DAppName } from '../../dApps/AccessChannels/DAppName';

export type CredentialInput = DAppName & {
  message: IEncryptedMessage;
  specVersion: '1.0' | '3.0';
};

export type CredentialOutput = IEncryptedMessage | void;
