import { HexString } from '@polkadot/util/types';
import { DidResourceUri, DidUri, ICredential } from '@kiltprotocol/sdk-js';

import { DAppName } from '../../dApps/AccessChannels/DAppName';
import { Origin } from '../../dApps/AccessChannels/Origin';

export type SignDidInput = DAppName & {
  plaintext: string;
  didUri?: DidUri;
};

export type SignDidOriginInput = SignDidInput & Origin;

export interface SignDidOutput {
  signature: HexString;
  didKeyUri: DidResourceUri;
  credentials?: { name: string; credential: ICredential }[];
}
