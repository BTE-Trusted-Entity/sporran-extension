import { HexString } from '@polkadot/util/types';
import { DidResourceUri, ICredential } from '@kiltprotocol/types';

import { DAppName } from '../../dApps/AccessChannels/DAppName';
import { Origin } from '../../dApps/AccessChannels/Origin';

export type SignDidInput = DAppName & {
  plaintext: string;
};

export type SignDidOriginInput = SignDidInput & Origin;

export interface SignDidOutput {
  signature: HexString;
  didKeyUri: DidResourceUri;
  credentials?: { name: string; credential: ICredential }[];
}
