import { HexString } from '@polkadot/util/types';
import { DidResourceUri, KiltAddress } from '@kiltprotocol/types';

import { DAppName } from '../../dApps/AccessChannels/DAppName';
import { Origin } from '../../dApps/AccessChannels/Origin';

export type SignDidExtrinsicInput = DAppName & {
  extrinsic: HexString;
  signer: KiltAddress;
};

export type SignDidExtrinsicOriginInput = SignDidExtrinsicInput & Origin;

export interface SignDidExtrinsicOutput {
  signed: HexString;
  didKeyUri: DidResourceUri;
}
