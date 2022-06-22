import { HexString } from '@polkadot/util/types';
import { DidPublicKey } from '@kiltprotocol/types';

import { Credential } from '@kiltprotocol/core';

import { DAppName } from '../../dApps/AccessChannels/DAppName';
import { Origin } from '../../dApps/AccessChannels/Origin';

export type SignDidInput = DAppName & {
  plaintext: string;
};

export type SignDidOriginInput = SignDidInput & Origin;

export interface SignDidOutput {
  signature: HexString;
  didKeyUri: DidPublicKey['id'];
  credentials?: { name: string; credential: Credential }[];
}
