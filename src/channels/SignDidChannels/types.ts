import { DAppName } from '../../dApps/AccessChannels/DAppName';

export type SignDidInput = DAppName & {
  plaintext: string;
  origin: string;
};

export interface SignDidOutput {
  signature: string;
  did: string;
}
