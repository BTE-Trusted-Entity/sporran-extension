import { IMessage, IPublicIdentity } from '@kiltprotocol/types';

import { injectedCredentialChannel } from './channels/CredentialChannels/injectedCredentialChannel';
import {
  authenticate,
  injectIntoDApp,
} from './dApps/injectIntoDApp/injectIntoDApp';
import { configuration } from './configuration/configuration';

// TODO: switch to IEncryptedMessage
interface PubSubSession {
  listen: (callback: (message: IMessage) => Promise<void>) => Promise<void>;
  close: () => Promise<void>;
  send: (message: IMessage) => Promise<void>;
  account: IPublicIdentity;
}

interface InjectedWindowProvider {
  startSession: (
    origin: string,
    account: IPublicIdentity,
  ) => Promise<PubSubSession>;
  version: string;
  specVersion: '0.1';
}

let dAppIdentity: IPublicIdentity;
const sporranIdentity: IPublicIdentity = {
  // TODO: real values
  address: '4quK7LGg8iGqoH8kmeEeCDN7VM1aN5wmKkAfcH1VVU8tFmMc',
  boxPublicKeyAsHex:
    '0xe5a91394ab38253ae192d22914618ce868601d15190ca8ed35b5b81a1c9cd10e',
};

let onMessageFromSporran: (message: IMessage) => Promise<void>;

const unprocessedMessagesFromSporran: IMessage[] = [];

async function storeMessageFromSporran(message: IMessage): Promise<void> {
  unprocessedMessagesFromSporran.push(message);
}

async function startSession(unsafeDAppName: string, identity: IPublicIdentity) {
  dAppIdentity = identity;

  const dAppName = unsafeDAppName.substring(0, 50);
  await authenticate({ dAppName });

  onMessageFromSporran = storeMessageFromSporran;

  return {
    /** Sporran public identity */
    account: sporranIdentity,

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
      const messageFromSporran = await injectedCredentialChannel.get({
        message,
        dAppName,
        dAppIdentity,
        sporranIdentity,
      });
      if (messageFromSporran) {
        await onMessageFromSporran(messageFromSporran);
      }
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
    startSession,
    version,
    specVersion: '0.1',
  };
}

main();
