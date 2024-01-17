import type {
  DidUrl,
  KiltKeyringPair,
  VerificationMethod,
} from '@kiltprotocol/types';
import type {
  EncryptRequestData,
  IEncryptedMessage,
  IMessage,
  MessageBody,
} from '@kiltprotocol/extension-api/types';

import { Runtime } from 'webextension-polyfill';
import { Keypair } from '@polkadot/util-crypto/types';

import { DidResolver } from '@kiltprotocol/sdk-js';
import { Crypto } from '@kiltprotocol/utils';
import { createLightDidDocument } from '@kiltprotocol/did';
import * as Message from '@kiltprotocol/extension-api/messaging';

import { verifyDidConfigResource } from '../wellKnownDid/wellKnownDid';
import { getDidEncryptionKey } from '../did/did';

interface TabEncryption {
  authenticationKey: KiltKeyringPair;
  encryptionKey: Keypair;
  sporranEncryptionDidKeyUri: DidUrl;
  dAppEncryptionDidKey: VerificationMethod;
  decrypt: (encrypted: IEncryptedMessage) => Promise<IMessage>;
  encrypt: (messageBody: MessageBody) => Promise<IEncryptedMessage>;
}

const tabEncryptions: Record<number, TabEncryption> = {};

export async function getTabEncryption(
  sender: Runtime.MessageSender,
  dAppEncryptionKeyUri?: DidUrl,
): Promise<TabEncryption> {
  if (!sender.tab || !sender.tab.id || !sender.url) {
    throw new Error('Message not from a tab');
  }

  const tabId = sender.tab.id;

  if (tabId in tabEncryptions) {
    return tabEncryptions[tabId];
  }
  if (!dAppEncryptionKeyUri) {
    throw new Error(
      'Cannot generate encryption outside challenge flow. Have you called startSession() before?',
    );
  }

  const encryptionKey = Crypto.makeEncryptionKeypairFromSeed();
  const { secretKey } = encryptionKey;

  const baseKey = Crypto.makeKeypairFromSeed(secretKey.slice(0, 32), 'sr25519');
  const authenticationKey = baseKey.derive(
    '//authentication',
  ) as typeof baseKey;

  const sporranDidDocument = createLightDidDocument({
    authentication: [authenticationKey],
    keyAgreement: [encryptionKey],
  });
  const sporranEncryptionDidKey = getDidEncryptionKey(sporranDidDocument);
  const sporranEncryptionDidKeyUri =
    `${sporranDidDocument.id}${sporranEncryptionDidKey}` as DidUrl;

  const { contentStream } = await DidResolver.dereference(
    dAppEncryptionKeyUri,
    {},
  );
  const dAppEncryptionDidKey = contentStream as VerificationMethod | undefined;

  if (dAppEncryptionDidKey?.type !== 'Multikey') {
    throw new Error(
      `DApp encryption key ${dAppEncryptionKeyUri} does not resolve to a Multikey verification key as expected`,
    );
  }

  const dAppDid = dAppEncryptionDidKey.controller;

  await verifyDidConfigResource(dAppDid, sender.url);

  async function decrypt(encrypted: IEncryptedMessage): Promise<IMessage> {
    return Message.decrypt(
      encrypted,
      async ({ data: box, peerPublicKey, nonce }) => {
        const data = Crypto.decryptAsymmetric(
          { box, nonce },
          peerPublicKey,
          secretKey,
        );
        if (!data) {
          throw new Error('Failed to decrypt with given key');
        }

        return { data };
      },
    );
  }

  async function encryptCallback({ data, peerPublicKey }: EncryptRequestData) {
    const { nonce, box } = Crypto.encryptAsymmetric(
      data,
      peerPublicKey,
      secretKey,
    );

    return {
      data: box,
      nonce,
      keyUri: sporranEncryptionDidKeyUri,
    };
  }

  async function encrypt(messageBody: MessageBody): Promise<IEncryptedMessage> {
    const message = Message.fromBody(
      messageBody,
      sporranDidDocument.id,
      dAppDid,
    );

    return Message.encrypt(
      message,
      encryptCallback,
      `${sporranDidDocument.id}${getDidEncryptionKey(sporranDidDocument)}`,
    );
  }

  tabEncryptions[tabId] = {
    authenticationKey,
    encryptionKey,
    sporranEncryptionDidKeyUri,
    dAppEncryptionDidKey,
    decrypt,
    encrypt,
  };

  return tabEncryptions[tabId];
}
