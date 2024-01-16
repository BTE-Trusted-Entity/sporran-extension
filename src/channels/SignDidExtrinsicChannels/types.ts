import type { Did, DidUrl, KiltAddress } from '@kiltprotocol/types';

import { HexString } from '@polkadot/util/types';

import { DAppName } from '../../dApps/AccessChannels/DAppName';
import { Origin } from '../../dApps/AccessChannels/Origin';

export type SignDidExtrinsicInput = DAppName & {
  extrinsic: HexString;
  submitter: KiltAddress;
  didUri?: Did;
};

export type SignDidExtrinsicOriginInput = SignDidExtrinsicInput & Origin;

export interface SignDidExtrinsicOutput {
  signed: HexString;
  didKeyUri: DidUrl;
}
