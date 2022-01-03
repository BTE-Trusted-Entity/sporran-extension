import { DAppName } from '../../dApps/AccessChannels/DAppName';
import { Origin } from '../../dApps/AccessChannels/Origin';

export type SignDidInput = DAppName & {
  plaintext: string;
};

export type SignDidOriginInput = SignDidInput & Origin;

export interface SignDidOutput {
  signature: string;
  did: string;
}
