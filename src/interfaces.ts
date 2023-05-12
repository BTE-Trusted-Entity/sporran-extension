import {
  DidResourceUri,
  DidUri,
  IEncryptedMessage,
  KiltAddress,
} from '@kiltprotocol/sdk-js';
import { HexString } from '@polkadot/util/types';

export interface IEncryptedMessageV1 {
  /** ID of the key agreement key of the receiver DID used to encrypt the message */
  receiverKeyId: DidResourceUri;

  /** ID of the key agreement key of the sender DID used to encrypt the message */
  senderKeyId: DidResourceUri;

  /** ciphertext as hexadecimal */
  ciphertext: string;

  /** 24 bytes nonce as hexadecimal */
  nonce: string;
}

export interface PubSubSessionV1 {
  /** Configure the callback the extension must use to send messages to the dApp. Overrides previous values. */
  listen: (
    callback: (message: IEncryptedMessageV1) => Promise<void>,
  ) => Promise<void>;

  /** send the encrypted message to the extension */
  send: (message: IEncryptedMessageV1) => Promise<void>;

  /** close the session and stop receiving further messages */
  close: () => Promise<void>;

  /** ID of the key agreement key of the temporary DID the extension will use to encrypt the session messages */
  encryptionKeyId: string;

  /** bytes as hexadecimal */
  encryptedChallenge: string;

  /** 24 bytes nonce as hexadecimal */
  nonce: string;
}

export interface PubSubSessionV2 {
  /** Configure the callback the extension must use to send messages to the dApp. Overrides previous values. */
  listen: (
    callback: (message: IEncryptedMessage) => Promise<void>,
  ) => Promise<void>;

  /** send the encrypted message to the extension */
  send: (message: IEncryptedMessage) => Promise<void>;

  /** close the session and stop receiving further messages */
  close: () => Promise<void>;

  /** ID of the key agreement key of the temporary DID the extension will use to encrypt the session messages */
  encryptionKeyUri: DidResourceUri;

  /** bytes as hexadecimal */
  encryptedChallenge: string;

  /** 24 bytes nonce as hexadecimal */
  nonce: string;
}

export interface InjectedWindowProvider<T> {
  startSession: (
    dAppName: string,
    dAppEncryptionKeyId: DidResourceUri,
    challenge: string,
  ) => Promise<T>;

  name: string;
  version: string;
  specVersion: '1.0' | '3.0';

  signWithDid: (
    plaintext: string,
    didUri?: DidUri,
  ) => Promise<{ signature: string; didKeyUri: DidResourceUri }>;

  signExtrinsicWithDid: (
    extrinsic: HexString,
    signer: KiltAddress,
  ) => Promise<{ signed: HexString; didKeyUri: DidResourceUri }>;

  getSignedDidCreationExtrinsic: (
    submitter: KiltAddress,
    pendingDidUri?: DidUri,
  ) => Promise<{ signedExtrinsic: HexString }>;
}
