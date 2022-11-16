import { Runtime } from 'webextension-polyfill-ts';
import { Keypair } from '@polkadot/util-crypto/types';
import {
  ed25519PairFromRandom,
  naclOpen,
  naclSeal,
} from '@polkadot/util-crypto';
import {
  DidResourceUri,
  IEncryptedMessage,
  IMessage,
  KiltKeyringPair,
  MessageBody,
  ResolvedDidKey,
} from '@kiltprotocol/types';
import * as Message from '@kiltprotocol/messaging';
import { createLightDidDocument, resolveKey } from '@kiltprotocol/did';
import { Crypto } from '@kiltprotocol/utils';

import { verifyDidConfigResource } from '../wellKnownDid/wellKnownDid';
import { getDidEncryptionKey } from '../did/did';

interface TabEncryption {
  authenticationKey: KiltKeyringPair;
  encryptionKey: Keypair;
  sporranEncryptionDidKeyUri: DidResourceUri;
  dAppEncryptionDidKey: ResolvedDidKey;
  decrypt: (encrypted: IEncryptedMessage) => Promise<IMessage>;
  encrypt: (messageBody: MessageBody) => Promise<IEncryptedMessage>;
}

const tabEncryptions: Record<number, TabEncryption> = {};

export async function getTabEncryption(
  sender: Runtime.MessageSender,
  dAppEncryptionKeyUri?: DidResourceUri,
): Promise<TabEncryption> {
  if (!sender.tab || !sender.tab.id || !sender.url) {
    throw new Error('Message not from a tab');
  }

  const tabId = sender.tab.id;

  if (tabId in tabEncryptions) {
    return tabEncryptions[tabId];
  }
  if (!dAppEncryptionKeyUri) {
    throw new Error('Cannot generate encryption outside challenge flow');
  }

  const encryptionKey = Crypto.makeEncryptionKeypairFromSeed(
    ed25519PairFromRandom().secretKey,
  );
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
    `${sporranDidDocument.uri}${sporranEncryptionDidKey.id}` as DidResourceUri;

  const dAppEncryptionDidKey = await resolveKey(dAppEncryptionKeyUri);
  const dAppDid = dAppEncryptionDidKey.controller;
  await verifyDidConfigResource(dAppDid, sender.url);

  async function decrypt(encrypted: IEncryptedMessage): Promise<IMessage> {
    return Message.decrypt(
      encrypted,
      async ({ data, peerPublicKey, nonce }) => {
        const decrypted = naclOpen(data, nonce, peerPublicKey, secretKey);
        if (!decrypted) {
          throw new Error('Failed to decrypt with given key');
        }

        return { data: decrypted };
      },
    );
  }

  async function encrypt(messageBody: MessageBody): Promise<IEncryptedMessage> {
    const message = Message.fromBody(
      messageBody,
      sporranDidDocument.uri,
      dAppDid,
    );
    return Message.encrypt(
      message,
      async ({ data, peerPublicKey }) => {
        const { sealed, nonce } = naclSeal(data, secretKey, peerPublicKey);
        return {
          data: sealed,
          nonce,
          keyUri: sporranEncryptionDidKeyUri,
        };
      },
      dAppEncryptionKeyUri as DidResourceUri,
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
