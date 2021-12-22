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
  IDidKeyDetails,
  IEncryptedMessage,
  IMessage,
  KeyRelationship,
  MessageBody,
  NaclBoxCapable,
} from '@kiltprotocol/types';
import { Message } from '@kiltprotocol/messaging';
import { DefaultResolver, LightDidDetails } from '@kiltprotocol/did';

import { makeKeyring } from '../identities/identities';
import { verifyDidConfigResource } from '../wellKnownDid/wellKnownDid';

interface TabEncryption {
  authenticationKey: KeyringPair;
  encryptionKey: Keypair;
  sporranEncryptionDidKey: IDidKeyDetails;
  dAppEncryptionDidKey: IDidKeyDetails;
  decrypt: (encrypted: IEncryptedMessage) => Promise<IMessage>;
  encrypt: (messageBody: MessageBody) => Promise<IEncryptedMessage>;
}

const tabEncryptions: Record<number, TabEncryption> = {};

const { keyAgreement } = KeyRelationship;

function makeKeystore({
  secretKey,
}: Keypair): Pick<NaclBoxCapable, 'decrypt' | 'encrypt'> {
  return {
    async decrypt({ data, alg, nonce, peerPublicKey }) {
      const decrypted = naclOpen(data, nonce, peerPublicKey, secretKey);
      if (!decrypted) {
        throw new Error('Failed to decrypt with given key');
      }

      return {
        data: decrypted,
        alg,
      };
    },
    async encrypt({ data, alg, peerPublicKey }) {
      const { sealed, nonce } = naclSeal(data, secretKey, peerPublicKey);

      return {
        data: sealed,
        alg,
        nonce,
      };
    },
  };
}

export async function getTabEncryption(
  sender: Runtime.MessageSender,
  dAppEncryptionKeyId?: IDidKeyDetails['id'],
): Promise<TabEncryption> {
  if (!sender.tab || !sender.tab.id || !sender.url) {
    throw new Error('Message not from a tab');
  }

  const tabId = sender.tab.id;

  if (tabId in tabEncryptions) {
    return tabEncryptions[tabId];
  }
  if (!dAppEncryptionKeyId) {
    throw new Error('Cannot generate encryption outside challenge flow');
  }

  const encryptionKey = {
    ...naclBoxPairFromSecret(ed25519PairFromRandom().secretKey),
    type: 'x25519',
  };
  const authenticationKey = makeKeyring()
    .addFromSeed(encryptionKey.secretKey.slice(0, 32))
    .derive('//authentication');

  const keystore = makeKeystore(encryptionKey);

  const sporranDidDetails = new LightDidDetails({
    authenticationKey,
    encryptionKey,
  });
  const sporranEncryptionKey = sporranDidDetails
    .getKeys(keyAgreement)
    .pop() as IDidKeyDetails<string>;

  const dAppEncryptionKey = await DefaultResolver.resolveKey(
    dAppEncryptionKeyId,
  );
  if (!dAppEncryptionKey) {
    throw new Error('Receiver key agreement key not found');
  }

  const dAppDid = dAppEncryptionKey.controller;
  await verifyDidConfigResource(dAppDid, sender.url);

  async function decrypt(encrypted: IEncryptedMessage): Promise<IMessage> {
    return Message.decrypt(encrypted, keystore);
  }

  async function encrypt(messageBody: MessageBody): Promise<IEncryptedMessage> {
    const message = new Message(messageBody, sporranDidDetails.did, dAppDid);
    return message.encrypt(
      sporranEncryptionKey,
      dAppEncryptionKey as IDidKeyDetails,
      keystore,
    );
  }

  tabEncryptions[tabId] = {
    authenticationKey,
    encryptionKey,
    sporranEncryptionDidKey: sporranEncryptionKey,
    dAppEncryptionDidKey: dAppEncryptionKey,
    decrypt,
    encrypt,
  };

  return tabEncryptions[tabId];
}
