import BN from 'bn.js';
import { map, zip } from 'lodash-es';
import { browser } from 'webextension-polyfill-ts';
import { BlockchainApiConnection } from '@kiltprotocol/chain-helpers';
import { Identity } from '@kiltprotocol/core';
import { SignerPayloadJSON } from '@polkadot/types/types/extrinsic';
import type {
  ExtrinsicPayload,
  ExtrinsicEra,
} from '@polkadot/types/interfaces';

import { makeUsePopupQuery } from '../../utilities/popups/usePopupQuery';
import { PopupChannel } from '../../channels/base/PopupChannel/PopupChannel';
import { decryptAccount } from '../../utilities/accounts/accounts';
import { contentSignChannel } from './contentSignChannel';

interface SignBgInput {
  origin: string;
  address: string;
  specVersion: number;
  nonce: number;
  method: string;
  lifetimeStart?: number;
  lifetimeEnd?: number;
}

type SignBgJsonInput = {
  origin: string;
  address: string;
  specVersion: string;
  nonce: string;
  method: string;
  lifetimeStart?: string;
  lifetimeEnd?: string;
};

type SignBgOutput = string;

type SenderType = Parameters<
  Parameters<typeof browser.runtime.onMessage.addListener>[0]
>[1];

const transformBackground = {
  inputToJson: ({ lifetimeStart, lifetimeEnd, ...input }: SignBgInput) => ({
    ...input,
    specVersion: input.specVersion.toString(),
    nonce: input.nonce.toString(),
    ...(lifetimeStart &&
      lifetimeEnd && {
        lifetimeStart: lifetimeStart.toString(),
        lifetimeEnd: lifetimeEnd.toString(),
      }),
  }),
  jsonToInput: ({ lifetimeStart, lifetimeEnd, ...input }: SignBgJsonInput) => ({
    ...input,
    specVersion: parseInt(input.specVersion, 10),
    nonce: parseInt(input.nonce, 10),
    ...(lifetimeStart &&
      lifetimeEnd && {
        lifetimeStart: parseInt(lifetimeStart, 10),
        lifetimeEnd: parseInt(lifetimeEnd, 10),
      }),
  }),
};

export const backgroundSignChannel = new PopupChannel<
  SignBgInput,
  SignBgOutput,
  SignBgJsonInput
>('sign', transformBackground);

async function getExtrinsic(input: SignerPayloadJSON) {
  const { api } = await BlockchainApiConnection.getConnectionOrConnect();
  api.registry.setSignedExtensions(input.signedExtensions);

  const params = { version: input.version };
  return api.registry.createType('ExtrinsicPayload', input, params);
}

async function getMethodText(methodSource: string) {
  const { api } = await BlockchainApiConnection.getConnectionOrConnect();
  const call = api.registry.createType('Call', methodSource);

  const { section, method, meta } = call;

  const argumentValues = call.toHuman().args as unknown[];
  const argumentNames = meta && map(meta.args, 'name');
  const nameValuePairs = meta && zip(argumentNames, argumentValues);

  const methodSignature = meta
    ? `(${nameValuePairs
        .map(([name, value]) => `${name} = ${JSON.stringify(value)}`)
        .join(', ')})`
    : '';

  return `${section}.${method}${methodSignature}`;
}

function getLifetime({ era }: { era: ExtrinsicEra }, hexBlockNumber: string) {
  const blockNumber = new BN(hexBlockNumber.substring(2), 16);
  return (
    !era.isImmortalEra && {
      lifetimeStart: era.asMortalEra.birth(blockNumber),
      lifetimeEnd: era.asMortalEra.death(blockNumber),
    }
  );
}

let id = 0;

function signExtrinsic(extrinsic: ExtrinsicPayload, identity: Identity) {
  const { signature } = extrinsic.sign(identity.signKeyringPair);

  id += 1;
  return { signature, id };
}

async function getSignature(
  input: Parameters<typeof contentSignChannel.get>[0],
  sender: SenderType,
) {
  const { origin, address, genesisHash } = input;

  const { api } = await BlockchainApiConnection.getConnectionOrConnect();
  const sameBlockchain = genesisHash === api.genesisHash.toString();
  if (!sameBlockchain) {
    throw new Error(`Wrong blockchain: genesisHash not equal "${genesisHash}"`);
  }

  const extrinsic = await getExtrinsic(input);
  const method = await getMethodText(input.method);
  const lifetime = getLifetime(extrinsic, input.blockNumber);

  const values = {
    origin,
    address,
    specVersion: extrinsic.specVersion.toNumber(),
    nonce: extrinsic.nonce.toNumber(),
    method,
    ...lifetime,
  };

  const password = await backgroundSignChannel.get(values, sender);
  return signExtrinsic(extrinsic, await decryptAccount(address, password));
}

export function initBackgroundSignChannel(): void {
  contentSignChannel.produce(getSignature);
}

export const useSignPopupQuery: () => SignBgInput = makeUsePopupQuery<
  SignBgInput,
  SignBgJsonInput
>(backgroundSignChannel.transform.jsonToInput);
