import { KiltAddress } from '@kiltprotocol/sdk-js';
import { HexString } from '@polkadot/util/types';

import { DAppName } from '../../dApps/AccessChannels/DAppName';
import { Origin } from '../../dApps/AccessChannels/Origin';

export type CreateDidInput = DAppName & {
  submitter: KiltAddress;
};

export type CreateDidOriginInput = CreateDidInput & Origin;

export interface CreateDidOutput {
  signedExtrinsic: HexString;
}
