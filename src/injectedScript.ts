import { IEncryptedMessage, IDidDetails } from '@kiltprotocol/types';

import { injectedCredentialChannel } from './channels/CredentialChannels/injectedCredentialChannel';
import {
  authenticate,
  injectIntoDApp,
} from './dApps/injectIntoDApp/injectIntoDApp';
import { configuration } from './configuration/configuration';
import { injectedChallengeChannel } from './channels/ChallengeChannels/injectedChallengeChannel';
import { injectedSignDidChannel } from './channels/SignDidChannels/injectedSignDidChannel';

interface PubSubSession {
  listen: (
    callback: (message: IEncryptedMessage) => Promise<void>,
  ) => Promise<void>;
  close: () => Promise<void>;
  send: (message: IEncryptedMessage) => Promise<void>;
  identity: IDidDetails['did'];
  encryptedChallenge: string;
  nonce: string;
}

interface InjectedWindowProvider {
  startSession: (
    dAppName: string,
    dAppDid: IDidDetails['did'],
    challenge: string,
  ) => Promise<PubSubSession>;
  name: string;
  version: string;
  specVersion: '0.1';
  signWithDid: (
    plaintext: string,
  ) => Promise<{ signature: string; did: string }>;
}

let onMessageFromSporran: (message: IEncryptedMessage) => Promise<void>;

const unprocessedMessagesFromSporran: IEncryptedMessage[] = [];

async function storeMessageFromSporran(
  message: IEncryptedMessage,
): Promise<void> {
  unprocessedMessagesFromSporran.push(message);
}

async function startSession(
  unsafeDAppName: string,
  dAppDid: IDidDetails['did'],
  challenge: string,
): Promise<PubSubSession> {
  const dAppName = unsafeDAppName.substring(0, 50);
  await authenticate({ dAppName });

  const { sporranDid, encryptedChallenge, nonce } =
    await injectedChallengeChannel.get({ challenge, dAppDid });

  onMessageFromSporran = storeMessageFromSporran;

  return {
    /** Sporran temporary identity */
    identity: sporranDid,

    /** dApp will use given callback to process messages from Sporran */
    async listen(
      dAppProcessesMessage: (message: IEncryptedMessage) => Promise<void>,
    ): Promise<void> {
      onMessageFromSporran = dAppProcessesMessage;

      let message;
      while ((message = unprocessedMessagesFromSporran.pop())) {
        await onMessageFromSporran(message);
      }
    },

    /** dApp stops accepting messages */
    async close(): Promise<void> {
      onMessageFromSporran = storeMessageFromSporran;
    },

    /** dApp sends a message */
    async send(message: IEncryptedMessage): Promise<void> {
      const messageFromSporran = await injectedCredentialChannel.get({
        message,
        dAppName,
      });
      if (messageFromSporran) {
        await onMessageFromSporran(messageFromSporran);
      }
    },

    encryptedChallenge,
    nonce,
  };
}

async function signWithDid(plaintext: string): Promise<{
  signature: string;
  did: string;
}> {
  return injectedSignDidChannel.get({ plaintext });
}

function main() {
  const { version } = configuration;

  injectIntoDApp(version);

  const apiWindow = window as unknown as {
    kilt: { sporran?: Partial<InjectedWindowProvider> };
  };

  if (!apiWindow.kilt || apiWindow.kilt.sporran) {
    return;
  }

  // Only injected scripts can create variables like this, content script cannot do this
  apiWindow.kilt ||= {};
  apiWindow.kilt.sporran ||= {};

  if (configuration.features.fullDid) {
    Object.assign(apiWindow.kilt.sporran, { signWithDid });
  }

  if (configuration.features.credentials) {
    Object.assign(apiWindow.kilt.sporran, {
      startSession,
      name: 'Sporran', // manifest_name
      version,
      specVersion: '0.1',
    });
  }
}

main();
