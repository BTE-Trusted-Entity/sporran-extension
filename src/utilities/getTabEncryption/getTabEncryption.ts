import { Runtime } from 'webextension-polyfill-ts';
import { KeyringPair } from '@polkadot/keyring/types';
import { Keypair } from '@polkadot/util-crypto/types';
import {
  naclKeypairFromRandom,
  naclBoxKeypairFromSecret,
  naclOpen,
  naclSeal,
} from '@polkadot/util-crypto';
import {
  IDidDetails,
  IDidKeyDetails,
  IEncryptedMessage,
  IMessage,
  KeyRelationship,
  MessageBody,
  NaclBoxCapable,
} from '@kiltprotocol/types';
import Message from '@kiltprotocol/messaging';
import { DefaultResolver, LightDidDetails } from '@kiltprotocol/did';

import { makeKeyring } from '../identities/identities';

interface TabEncryption {
  authenticationKey: KeyringPair;
  encryptionKey: Keypair;
  sporranDidDetails: IDidDetails;
  dAppDidDetails: IDidDetails;
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
  dAppDid?: IDidDetails['did'],
): Promise<TabEncryption> {
  if (!sender.tab || !sender.tab.id) {
    throw new Error('Message not from a tab');
  }

  const tabId = sender.tab.id;

  if (tabId in tabEncryptions) {
    return tabEncryptions[tabId];
  }
  if (!dAppDid) {
    throw new Error('Cannot generate encryption outside challenge flow');
  }

  const encryptionKey = {
    ...naclBoxKeypairFromSecret(naclKeypairFromRandom().secretKey),
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

  const dAppDidDetails = (await DefaultResolver.resolveDoc(
    dAppDid,
  )) as IDidDetails;
  if (!dAppDidDetails) {
    throw new Error(`Cannot resolve the dApp DID ${dAppDid}`);
  }
  const dAppEncryptionKey = dAppDidDetails
    .getKeys(keyAgreement)
    .pop() as IDidKeyDetails<string>;
  if (!dAppEncryptionKey) {
    throw new Error('Receiver key agreement key not found');
  }

  // TODO: check the domain’s DID Configuration

  async function decrypt(encrypted: IEncryptedMessage): Promise<IMessage> {
    const senderDetails = dAppDidDetails;
    return Message.decrypt(encrypted, keystore, { senderDetails });
  }

  async function encrypt(messageBody: MessageBody): Promise<IEncryptedMessage> {
    const message = new Message(
      messageBody,
      sporranDidDetails.did,
      dAppDidDetails.did,
    );
    return message.encrypt(sporranEncryptionKey, dAppEncryptionKey, keystore);
  }

  tabEncryptions[tabId] = {
    authenticationKey,
    encryptionKey,
    sporranDidDetails,
    dAppDidDetails,
    decrypt,
    encrypt,
  };

  return tabEncryptions[tabId];
}
