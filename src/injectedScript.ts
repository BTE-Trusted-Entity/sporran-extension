import {
  IEncryptedMessage,
  DidResourceUri,
  KiltAddress,
} from '@kiltprotocol/types';

import { HexString } from '@polkadot/util/types';

import { injectedCredentialChannel } from './channels/CredentialChannels/injectedCredentialChannel';
import { configuration } from './configuration/configuration';
import { injectedChallengeChannel } from './channels/ChallengeChannels/injectedChallengeChannel';
import { injectedAccessChannel } from './channels/AccessChannels/injectedAccessChannel';
import { injectedCreateDidChannel } from './channels/CreateDidChannels/injectedCreateDidChannel';

interface PubSubSession {
  listen: (
    callback: (message: IEncryptedMessage) => Promise<void>,
  ) => Promise<void>;
  close: () => Promise<void>;
  send: (message: IEncryptedMessage) => Promise<void>;
  encryptionKeyId: DidResourceUri;
  encryptedChallenge: string;
  nonce: string;
}

interface InjectedWindowProvider {
  startSession: (
    dAppName: string,
    dAppEncryptionKeyId: DidResourceUri,
    challenge: string,
  ) => Promise<PubSubSession>;
  name: string;
  version: string;
  specVersion: '1.0';
  getSignedDidCreationExtrinsic: (
    submitter: KiltAddress,
  ) => Promise<{ signedExtrinsic: HexString }>;
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
  dAppEncryptionKeyId: DidResourceUri,
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

async function getSignedDidCreationExtrinsic(submitter: KiltAddress): Promise<{
  signedExtrinsic: HexString;
}> {
  const dAppName = document.title.substring(0, 50);
  return injectedCreateDidChannel.get({ dAppName, submitter });
}

const { version } = configuration;

const apiWindow = window as unknown as {
  kilt: { sporran?: Partial<InjectedWindowProvider> };
};

function initialize() {
  // Only injected scripts can create variables like this, content script cannot do this
  apiWindow.kilt ||= {};
  apiWindow.kilt.sporran ||= {
    getSignedDidCreationExtrinsic,
    startSession,
    name: 'Sporran', // manifest_name
    version,
    specVersion: '1.0',
  };
  window.dispatchEvent(new CustomEvent('kilt-extension#initialized'));
  window.removeEventListener('kilt-dapp#initialized', initialize);
}

function main() {
  if (!apiWindow.kilt) {
    window.addEventListener('kilt-dapp#initialized', initialize);
    return;
  }

  if (apiWindow.kilt.sporran) {
    return;
  }

  initialize();
}

main();
