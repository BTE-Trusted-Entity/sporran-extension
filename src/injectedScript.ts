import { IEncryptedMessage, IDidKeyDetails } from '@kiltprotocol/types';

import { injectedCredentialChannel } from './channels/CredentialChannels/injectedCredentialChannel';
import { injectIntoDApp } from './dApps/injectIntoDApp/injectIntoDApp';
import { configuration } from './configuration/configuration';
import { injectedChallengeChannel } from './channels/ChallengeChannels/injectedChallengeChannel';
import { injectedSignDidChannel } from './channels/SignDidChannels/injectedSignDidChannel';
import { injectedAccessChannel } from './dApps/AccessChannels/injectedAccessChannel';

interface PubSubSession {
  listen: (
    callback: (message: IEncryptedMessage) => Promise<void>,
  ) => Promise<void>;
  close: () => Promise<void>;
  send: (message: IEncryptedMessage) => Promise<void>;
  encryptionKeyId: IDidKeyDetails['id'];
  encryptedChallenge: string;
  nonce: string;
}

interface InjectedWindowProvider {
  startSession: (
    dAppName: string,
    dAppEncryptionKeyId: IDidKeyDetails['id'],
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
  dAppEncryptionKeyId: IDidKeyDetails['id'],
  challenge: string,
): Promise<PubSubSession> {
  const dAppName = unsafeDAppName.substring(0, 50);
  await injectedAccessChannel.get({ dAppName });

  const { encryptionKeyId, encryptedChallenge, nonce } =
    await injectedChallengeChannel.get({ challenge, dAppEncryptionKeyId });

  onMessageFromSporran = storeMessageFromSporran;

  return {
    /** Sporran temporary identity */
    encryptionKeyId,

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
  const dAppName = document.title.substring(0, 50);
  return injectedSignDidChannel.get({ plaintext, dAppName });
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
  apiWindow.kilt.sporran ||= {
    signWithDid,
    startSession,
    name: 'Sporran', // manifest_name
    version,
    specVersion: '0.1',
  };
}

main();
