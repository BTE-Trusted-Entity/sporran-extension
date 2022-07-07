import { HexString } from '@polkadot/util/types';
import {
  IEncryptedMessage,
  IIdentity,
  DidResourceUri,
} from '@kiltprotocol/types';

import { injectedCredentialChannel } from './channels/CredentialChannels/injectedCredentialChannel';
import { injectIntoDApp } from './dApps/injectIntoDApp/injectIntoDApp';
import { configuration } from './configuration/configuration';
import { injectedChallengeChannel } from './channels/ChallengeChannels/injectedChallengeChannel';
import { injectedSignDidChannel } from './channels/SignDidChannels/injectedSignDidChannel';
import { injectedSignDidExtrinsicChannel } from './channels/SignDidExtrinsicChannels/injectedSignDidExtrinsicChannel';
import { injectedAccessChannel } from './dApps/AccessChannels/injectedAccessChannel';

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
  signWithDid: (
    plaintext: string,
  ) => Promise<{ signature: string; didKeyUri: DidResourceUri }>;
  signExtrinsicWithDid: (
    extrinsic: HexString,
    signer: IIdentity['address'],
  ) => Promise<{ signed: HexString; didKeyUri: DidResourceUri }>;
}

let onMessageFromSporran: (message: IEncryptedMessage) => Promise<void>;

const unprocessedMessagesFromSporran: IEncryptedMessage[] = [];

async function storeMessageFromSporran(
  message: IEncryptedMessage,
): Promise<void> {
  unprocessedMessagesFromSporran.push(message);
}

type CompatibleMessage = IEncryptedMessage & {
  receiverKeyId?: IEncryptedMessage['receiverKeyUri'];
  senderKeyId?: IEncryptedMessage['senderKeyUri'];
};

function makeBackwardsCompatible(message: CompatibleMessage) {
  message.receiverKeyId = message.receiverKeyUri;
  message.senderKeyId = message.senderKeyUri;
}

function makeFutureProof(message: CompatibleMessage) {
  message.senderKeyUri = message.senderKeyUri || message.senderKeyId;
  message.receiverKeyUri = message.receiverKeyUri || message.receiverKeyId;
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
        makeBackwardsCompatible(message);
        await onMessageFromSporran(message);
      }
    },

    /** dApp stops accepting messages */
    async close(): Promise<void> {
      onMessageFromSporran = storeMessageFromSporran;
    },

    /** dApp sends a message */
    async send(message: IEncryptedMessage): Promise<void> {
      makeFutureProof(message);

      const messageFromSporran = await injectedCredentialChannel.get({
        message,
        dAppName,
      });
      if (messageFromSporran) {
        makeBackwardsCompatible(messageFromSporran);
        await onMessageFromSporran(messageFromSporran);
      }
    },

    encryptedChallenge,
    nonce,
  };
}

async function signWithDid(plaintext: string): Promise<{
  signature: HexString;
  didKeyUri: DidResourceUri;
}> {
  const dAppName = document.title.substring(0, 50);
  return injectedSignDidChannel.get({ plaintext, dAppName });
}

async function signExtrinsicWithDid(
  extrinsic: HexString,
  signer: IIdentity['address'],
): Promise<{
  signed: HexString;
  didKeyUri: DidResourceUri;
}> {
  const dAppName = document.title.substring(0, 50);
  return injectedSignDidExtrinsicChannel.get({ extrinsic, signer, dAppName });
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
    signExtrinsicWithDid,
    startSession,
    name: 'Sporran', // manifest_name
    version,
    specVersion: '1.0',
  };
}

main();
