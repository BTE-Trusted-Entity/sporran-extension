import {
  IMessage,
  IPublicIdentity,
  MessageBodyType,
} from '@kiltprotocol/types';
import { injectedClaimChannel } from './channels/ClaimChannels/injectedClaimChannel';
import { injectedSaveChannel } from './channels/SaveChannels/injectedSaveChannel';
import { injectedShareChannel } from './channels/ShareChannels/injectedShareChannel';
import {
  authenticate,
  injectIntoDApp,
} from './dApps/injectIntoDApp/injectIntoDApp';
import { configuration } from './configuration/configuration';

async function showClaimPopup(values: { [key: string]: string }) {
  // Non-extension scripts cannot open windows with extension pages
  return injectedClaimChannel.get(values);
}

async function showSaveCredentialPopup(values: { [key: string]: string }) {
  // Non-extension scripts cannot open windows with extension pages
  return injectedSaveChannel.get(values);
}

async function showShareCredentialPopup(values: { [key: string]: string }) {
  // Non-extension scripts cannot open windows with extension pages
  return injectedShareChannel.get(values);
}

// TODO: switch to IEncryptedMessage
interface PubSubSession {
  listen: (callback: (message: IMessage) => Promise<void>) => Promise<void>;
  close: () => Promise<void>;
  send: (message: IMessage) => Promise<void>;
  account: IPublicIdentity;
}

interface InjectedWindowProvider {
  showClaimPopup: typeof showClaimPopup;
  showSaveCredentialPopup: typeof showSaveCredentialPopup;
  showShareCredentialPopup: typeof showShareCredentialPopup;

  startSession: (
    origin: string,
    account: IPublicIdentity,
  ) => Promise<PubSubSession>;
  version: string;
  specVersion: '0.1';
}

let dAppIdentity: IPublicIdentity;

let onMessageFromSporran: (message: IMessage) => Promise<void>;

const unprocessedMessagesFromSporran: IMessage[] = [];

async function storeMessageFromSporran(message: IMessage): Promise<void> {
  unprocessedMessagesFromSporran.push(message);
}

async function processMessageFromDApp(message: IMessage): Promise<void> {
  if (message.body.type === MessageBodyType.SUBMIT_TERMS) {
    // TODO: really handle terms instead of just sending the message back
    await onMessageFromSporran(message);
  }
}

async function startSession(unsafeDAppName: string, identity: IPublicIdentity) {
  dAppIdentity = identity;

  const dAppName = unsafeDAppName.substring(0, 50);
  await authenticate({ dAppName });

  onMessageFromSporran = storeMessageFromSporran;

  return {
    /** Sporran public identity */
    account: {
      // TODO: real values
      ...dAppIdentity,
      address: '4tDFy3ubRSio33vtu2N9zWoACqC6U12i4zmCnEuawXjn5SEP',
      boxPublicKeyAsHex:
        '0xe5a91394ab38253ae192d22914618ce868601d15190ca8ed35b5b81a1c9cd10e',
    },

    /** dApp will use given callback to process messages from Sporran */
    async listen(
      dAppProcessesMessage: (message: IMessage) => Promise<void>,
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
    async send(message: IMessage): Promise<void> {
      return await processMessageFromDApp(message);
    },
  };
}

function main() {
  const { version } = configuration;

  injectIntoDApp(version);

  const apiWindow = window as unknown as {
    kilt: { sporran?: InjectedWindowProvider };
  };

  if (!configuration.features.credentials || apiWindow.kilt?.sporran) {
    return;
  }

  // Only injected scripts can create variables like this, content script cannot do this
  apiWindow.kilt ||= {};
  apiWindow.kilt.sporran = {
    showClaimPopup,
    showSaveCredentialPopup,
    showShareCredentialPopup,
    startSession,
    version,
    specVersion: '0.1',
  };
}

main();
