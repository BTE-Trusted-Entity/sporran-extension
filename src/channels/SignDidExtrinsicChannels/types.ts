import { HexString } from '@polkadot/util/types';
import { DidResourceUri, DidUri, KiltAddress } from '@kiltprotocol/sdk-js';

import { DAppName } from '../../dApps/AccessChannels/DAppName';
import { Origin } from '../../dApps/AccessChannels/Origin';

export type SignDidExtrinsicInput = DAppName & {
  extrinsic: HexString;
  submitter: KiltAddress;
  didUri?: DidUri;
};

export type SignDidExtrinsicOriginInput = SignDidExtrinsicInput & Origin;

export interface SignDidExtrinsicOutput {
  signed: HexString;
  didKeyUri: DidResourceUri;
}
