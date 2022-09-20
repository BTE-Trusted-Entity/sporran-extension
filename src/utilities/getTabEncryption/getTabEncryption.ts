import { Runtime } from 'webextension-polyfill-ts';
import { KeyringPair } from '@polkadot/keyring/types';
import { Keypair } from '@polkadot/util-crypto/types';
import {
  ed25519PairFromRandom,
  naclBoxPairFromSecret,
  naclOpen,
  naclSeal,
} from '@polkadot/util-crypto';
import {
  IEncryptedMessage,
  IMessage,
  MessageBody,
  ResolvedDidKey,
  DidResourceUri,
  EncryptCallback,
  DecryptCallback,
  NewDidEncryptionKey,
} from '@kiltprotocol/types';
import * as Message from '@kiltprotocol/messaging';
import * as Did from '@kiltprotocol/did';

import { makeKeyring } from '../identities/identities';
import { verifyDidConfigResource } from '../wellKnownDid/wellKnownDid';
import { getDidEncryptionKey } from '../did/did';

interface TabEncryption {
  authenticationKey: KeyringPair;
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

  const encryptionKey: NewDidEncryptionKey & Keypair = {
    ...naclBoxPairFromSecret(ed25519PairFromRandom().secretKey),
    type: 'x25519',
  };
  const authenticationKey = makeKeyring()
    .addFromSeed(encryptionKey.secretKey.slice(0, 32))
    .derive('//authentication');

  const sporranDidDocument = Did.createLightDidDocument({
    authentication: [
      {
        ...authenticationKey,
        type: 'sr25519',
      },
    ],
    keyAgreement: [encryptionKey],
  });
  const sporranEncryptionDidKey = getDidEncryptionKey(sporranDidDocument);
  const sporranEncryptionDidKeyUri: DidResourceUri = `${sporranDidDocument.uri}${sporranEncryptionDidKey.id}`;

  const dAppEncryptionDidKey = (await Did.resolveKey(
    dAppEncryptionKeyUri,
  )) as ResolvedDidKey;
  if (!dAppEncryptionDidKey) {
    throw new Error('Receiver key agreement key not found');
  }

  const dAppDid = dAppEncryptionDidKey.controller;
  await verifyDidConfigResource(dAppDid, sender.url);

  const decryptBytes: DecryptCallback = async ({
    data,
    nonce,
    peerPublicKey,
  }) => {
    const decrypted = naclOpen(
      data,
      nonce,
      peerPublicKey,
      encryptionKey.secretKey,
    );
    if (!decrypted) {
      throw new Error('Failed to decrypt with given key');
    }

    return {
      data: decrypted,
    };
  };
  const encryptBytes: EncryptCallback = async ({ data, peerPublicKey }) => {
    const { sealed, nonce } = naclSeal(
      data,
      encryptionKey.secretKey,
      peerPublicKey,
    );

    return {
      data: sealed,
      keyUri: sporranEncryptionDidKeyUri,
      nonce,
    };
  };

  async function decrypt(encrypted: IEncryptedMessage): Promise<IMessage> {
    return Message.decrypt(encrypted, decryptBytes, sporranDidDocument);
  }

  async function encrypt(messageBody: MessageBody): Promise<IEncryptedMessage> {
    const message = Message.fromBody(
      messageBody,
      sporranDidDocument.uri,
      dAppDid,
    );
    return Message.encrypt(
      message,
      encryptBytes,
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
