import { find, mapValues } from 'lodash-es';
import {
  IMessage,
  IPublicIdentity,
  IRejectTerms,
  IRequestAttestationForClaim,
  IRequestClaimsForCTypes,
  ISubmitAttestationForClaim,
  ISubmitClaimsForCTypes,
  ISubmitTerms,
  MessageBodyType,
} from '@kiltprotocol/types';
import Message, { errorCheckMessageBody } from '@kiltprotocol/messaging';
import { injectedClaimChannel } from './channels/ClaimChannels/injectedClaimChannel';
import { injectedSaveChannel } from './channels/SaveChannels/injectedSaveChannel';
import { injectedShareChannel } from './channels/ShareChannels/injectedShareChannel';
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
  address: '4tDFy3ubRSio33vtu2N9zWoACqC6U12i4zmCnEuawXjn5SEP',
  boxPublicKeyAsHex:
    '0xe5a91394ab38253ae192d22914618ce868601d15190ca8ed35b5b81a1c9cd10e',
};

let onMessageFromSporran: (message: IMessage) => Promise<void>;

const unprocessedMessagesFromSporran: IMessage[] = [];

async function storeMessageFromSporran(message: IMessage): Promise<void> {
  unprocessedMessagesFromSporran.push(message);
}

async function processSubmitTerms(
  messageBody: ISubmitTerms,
  dAppName: string,
): Promise<void> {
  const { claim, cTypes, quote, legitimations, delegationId } =
    messageBody.content;
  try {
    const cType = find(cTypes, { hash: claim.cTypeHash });
    const requestForAttestation = await injectedClaimChannel.get({
      ...mapValues(claim.contents, (value) => String(value)),
      ...(cType && { 'Credential type': cType.schema.title }),
      claim: JSON.stringify(claim),
      legitimations: JSON.stringify(legitimations),
      ...(delegationId && { delegationId: JSON.stringify(delegationId) }),
      ...(quote && { total: String(quote.cost.gross) }),
      Attester: dAppName,
    });

    const requestForAttestationBody: IRequestAttestationForClaim = {
      content: { requestForAttestation },
      type: MessageBodyType.REQUEST_ATTESTATION_FOR_CLAIM,
    };
    const request = new Message(
      requestForAttestationBody,
      sporranIdentity,
      dAppIdentity,
    );
    await onMessageFromSporran(request);
  } catch (error) {
    const rejectionBody: IRejectTerms = {
      content: { claim, legitimations, delegationId },
      type: MessageBodyType.REJECT_TERMS,
    };
    const rejection = new Message(rejectionBody, sporranIdentity, dAppIdentity);
    await onMessageFromSporran(rejection);
  }
}

async function processSubmitCredential(
  messageBody: ISubmitAttestationForClaim,
): Promise<void> {
  const { claimHash } = messageBody.content.attestation;

  await injectedSaveChannel.get({ claimHash });
}

async function processShareCredential(
  messageBody: IRequestClaimsForCTypes,
): Promise<void> {
  const content = await injectedShareChannel.get({
    cTypeHashes: JSON.stringify(
      messageBody.content.map(({ cTypeHash }) => cTypeHash),
    ),
  });

  const credentialsBody: ISubmitClaimsForCTypes = {
    content,
    type: MessageBodyType.SUBMIT_CLAIMS_FOR_CTYPES,
  };
  const request = new Message(credentialsBody, sporranIdentity, dAppIdentity);
  await onMessageFromSporran(request);
}

async function processMessageFromDApp(
  message: IMessage,
  dAppName: string,
): Promise<void> {
  errorCheckMessageBody(message.body);

  if (message.body.type === MessageBodyType.SUBMIT_TERMS) {
    await processSubmitTerms(message.body as ISubmitTerms, dAppName);
  }

  if (message.body.type === MessageBodyType.SUBMIT_ATTESTATION_FOR_CLAIM) {
    await processSubmitCredential(message.body as ISubmitAttestationForClaim);
  }

  if (message.body.type === MessageBodyType.REQUEST_CLAIMS_FOR_CTYPES) {
    await processShareCredential(message.body as IRequestClaimsForCTypes);
  }
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
      await processMessageFromDApp(message, dAppName);
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
