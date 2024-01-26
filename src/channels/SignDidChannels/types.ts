import type { Did, DidUrl, ICredential } from '@kiltprotocol/types';

import { HexString } from '@polkadot/util/types';

import { DAppName } from '../../dApps/AccessChannels/DAppName';
import { Origin } from '../../dApps/AccessChannels/Origin';

export type SignDidInput = DAppName & {
  plaintext: string;
  didUri?: Did;
};

export type SignDidOriginInput = SignDidInput & Origin;

export interface SignDidOutput {
  signature: HexString;
  didKeyUri: DidUrl;
  credentials?: { name: string; credential: ICredential }[];
}
