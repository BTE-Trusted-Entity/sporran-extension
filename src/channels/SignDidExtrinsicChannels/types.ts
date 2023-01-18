import { HexString } from '@polkadot/util/types';
import { DidResourceUri, KiltAddress } from '@kiltprotocol/types';

import { DAppName } from '../AccessChannels/DAppName';
import { Origin } from '../AccessChannels/Origin';

export type SignDidExtrinsicInput = DAppName & {
  extrinsic: HexString;
  signer: KiltAddress;
};

export type SignDidExtrinsicOriginInput = SignDidExtrinsicInput & Origin;

export interface SignDidExtrinsicOutput {
  signed: HexString;
  didKeyUri: DidResourceUri;
}
