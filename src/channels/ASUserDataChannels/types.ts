import { DidUri, KiltAddress } from '@kiltprotocol/types';
import { HexString } from '@polkadot/util/types';

import { DAppName } from '../AccessChannels/DAppName';
import { Origin } from '../AccessChannels/Origin';

export type ASUserDataInput = DAppName & {
  submitter: KiltAddress;
};

export type ASUserDataOriginInput = ASUserDataInput & Origin;

export interface ASUserDataOutput {
  createDidExtrinsic: HexString;
  did: DidUri;
  firstName: string;
  surname: string;
  email: string;
}
