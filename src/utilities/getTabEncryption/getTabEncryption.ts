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
  DidEncryptionKey,
  DidPublicKey,
  EncryptionKeyType,
  IEncryptedMessage,
  IMessage,
  MessageBody,
  NaclBoxCapable,
  ResolvedDidKey,
  VerificationKeyType,
} from '@kiltprotocol/types';
import { Message } from '@kiltprotocol/messaging';
import { DidResolver, LightDidDetails } from '@kiltprotocol/did';

import { makeKeyring } from '../identities/identities';
import { verifyDidConfigResource } from '../wellKnownDid/wellKnownDid';
import { getDidEncryptionKey } from '../did/did';

interface TabEncryption {
  authenticationKey: KeyringPair;
  encryptionKey: Keypair;
  sporranEncryptionDidKey: DidEncryptionKey;
  dAppEncryptionDidKey: ResolvedDidKey;
  decrypt: (encrypted: IEncryptedMessage) => Promise<IMessage>;
  encrypt: (messageBody: MessageBody) => Promise<IEncryptedMessage>;
}

const tabEncryptions: Record<number, TabEncryption> = {};

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
  dAppEncryptionKeyId?: DidPublicKey['id'],
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
    type: EncryptionKeyType.X25519,
  };
  const authenticationKey = makeKeyring()
    .addFromSeed(encryptionKey.secretKey.slice(0, 32))
    .derive('//authentication');

  const keystore = makeKeystore(encryptionKey);

  const sporranDidDetails = LightDidDetails.fromDetails({
    authenticationKey: {
      ...authenticationKey,
      type: VerificationKeyType.Sr25519,
    },
    encryptionKey,
  });
  const sporranEncryptionKey = getDidEncryptionKey(sporranDidDetails);

  const dAppEncryptionKey = (await DidResolver.resolveKey(
    dAppEncryptionKeyId,
  )) as ResolvedDidKey;
  if (!dAppEncryptionKey) {
    throw new Error('Receiver key agreement key not found');
  }

  const dAppDid = dAppEncryptionKey.controller;
  await verifyDidConfigResource(dAppDid, sender.url);

  async function decrypt(encrypted: IEncryptedMessage): Promise<IMessage> {
    return Message.decrypt(encrypted, keystore, sporranDidDetails);
  }

  async function encrypt(messageBody: MessageBody): Promise<IEncryptedMessage> {
    const message = new Message(messageBody, sporranDidDetails.did, dAppDid);
    return message.encrypt(
      sporranEncryptionKey.id,
      sporranDidDetails,
      keystore,
      dAppEncryptionKey.id,
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
