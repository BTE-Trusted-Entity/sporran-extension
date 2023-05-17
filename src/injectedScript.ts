import { HexString } from '@polkadot/util/types';
import {
  IEncryptedMessage,
  DidResourceUri,
  DidUri,
  KiltAddress,
} from '@kiltprotocol/sdk-js';

import { injectedCredentialChannel } from './channels/CredentialChannels/injectedCredentialChannel';
import { injectIntoDApp } from './dApps/injectIntoDApp/injectIntoDApp';
import { configuration } from './configuration/configuration';
import { injectedChallengeChannel } from './channels/ChallengeChannels/injectedChallengeChannel';
import { injectedSignDidChannel } from './channels/SignDidChannels/injectedSignDidChannel';
import { injectedSignDidExtrinsicChannel } from './channels/SignDidExtrinsicChannels/injectedSignDidExtrinsicChannel';
import { injectedCreateDidChannel } from './channels/CreateDidChannels/injectedCreateDidChannel';
import { injectedShareIdentitiesChannel } from './channels/ShareIdentitiesChannels/injectedShareIdentitiesChannel';
import { injectedAccessChannel } from './dApps/AccessChannels/injectedAccessChannel';
import {
  IEncryptedMessageV1,
  InjectedWindowProvider,
  PubSubSessionV1,
  PubSubSessionV2,
} from './interfaces';

let onMessageFromSporran: (message: IEncryptedMessage) => Promise<void>;

const unprocessedMessagesFromSporran: IEncryptedMessage[] = [];

function toMessageV1(message: IEncryptedMessage): IEncryptedMessageV1 {
  const { receiverKeyUri, senderKeyUri, ...rest } = message;
  return {
    ...rest,
    receiverKeyId: receiverKeyUri,
    senderKeyId: senderKeyUri,
  };
}

function fromMessageV1(message: IEncryptedMessageV1): IEncryptedMessage {
  const { receiverKeyId, senderKeyId, ...rest } = message;
  return {
    ...rest,
    receiverKeyUri: receiverKeyId,
    senderKeyUri: senderKeyId,
  };
}

async function storeMessageFromSporran(
  message: IEncryptedMessage,
): Promise<void> {
  unprocessedMessagesFromSporran.push(message);
}

async function startSession(
  unsafeDAppName: string,
  dAppEncryptionKeyId: DidResourceUri,
  challenge: string,
): Promise<PubSubSessionV1 | PubSubSessionV2> {
  const dAppName = unsafeDAppName.substring(0, 50);
  await injectedAccessChannel.get({ dAppName });

  const { encryptionKeyId, encryptedChallenge, nonce } =
    await injectedChallengeChannel.get({ challenge, dAppEncryptionKeyId });

  onMessageFromSporran = storeMessageFromSporran;

  const specVersion = apiWindow.kilt.sporran?.specVersion;

  // TODO: reduce code duplication
  if (specVersion === '3.0') {
    return {
      /** Sporran temporary identity */
      encryptionKeyUri: encryptionKeyId,

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
          specVersion,
        });
        if (messageFromSporran) {
          await onMessageFromSporran(messageFromSporran);
        }
      },

      encryptedChallenge,
      nonce,
    };
  }

  if (specVersion !== '1.0') {
    throw new Error(`Unknown spec version ${specVersion}`);
  }

  return {
    /** Sporran temporary identity */
    encryptionKeyId,

    /** dApp will use given callback to process messages from Sporran */
    async listen(
      dAppProcessesMessage: (message: IEncryptedMessageV1) => Promise<void>,
    ): Promise<void> {
      onMessageFromSporran = (message) =>
        dAppProcessesMessage(toMessageV1(message));

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
    async send(message: IEncryptedMessageV1): Promise<void> {
      const messageFromSporran = await injectedCredentialChannel.get({
        message: fromMessageV1(message),
        dAppName,
        specVersion,
      });
      if (messageFromSporran) {
        await onMessageFromSporran(messageFromSporran);
      }
    },

    encryptedChallenge,
    nonce,
  };
}

function getDidList(): ReturnType<
  InjectedWindowProvider<unknown>['getDidList']
> {
  const dAppName = document.title.substring(0, 50);
  return injectedShareIdentitiesChannel.get({ dAppName });
}

async function signWithDid(
  plaintext: string,
  didUri?: DidUri,
): Promise<{
  signature: HexString;
  didKeyUri: DidResourceUri;
}> {
  const dAppName = document.title.substring(0, 50);
  return injectedSignDidChannel.get({ plaintext, didUri, dAppName });
}

async function signExtrinsicWithDid(
  extrinsic: HexString,
  submitter: KiltAddress,
  didUri?: DidUri,
): Promise<{
  signed: HexString;
  didKeyUri: DidResourceUri;
}> {
  const dAppName = document.title.substring(0, 50);
  return injectedSignDidExtrinsicChannel.get({
    extrinsic,
    submitter,
    didUri,
    dAppName,
  });
}

async function getSignedDidCreationExtrinsic(
  submitter: KiltAddress,
  pendingDidUri?: DidUri,
): Promise<{
  signedExtrinsic: HexString;
}> {
  const dAppName = document.title.substring(0, 50);
  return injectedCreateDidChannel.get({ dAppName, pendingDidUri, submitter });
}

const { version } = configuration;

const apiWindow = window as unknown as {
  kilt: {
    meta?: { versions: { credentials: string } };
    sporran?: Partial<
      InjectedWindowProvider<PubSubSessionV1 | PubSubSessionV2>
    >;
  };
};

function initialize() {
  // Only injected scripts can create variables like this, content script cannot do this
  apiWindow.kilt ||= {};
  // detect specVersion to use
  const specVersion = apiWindow.kilt?.meta?.versions?.credentials?.startsWith(
    '3.',
  )
    ? '3.0'
    : '1.0';

  apiWindow.kilt.sporran ||= {
    getDidList,
    signWithDid,
    signExtrinsicWithDid,
    getSignedDidCreationExtrinsic,
    startSession,
    name: 'Sporran', // manifest_name
    version,
    specVersion,
  };
  window.dispatchEvent(new CustomEvent('kilt-extension#initialized'));
  window.removeEventListener('kilt-dapp#initialized', initialize);
}

function main() {
  injectIntoDApp(version);

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
