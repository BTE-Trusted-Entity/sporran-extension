import { DAppName } from '../../dApps/AccessChannels/DAppName';

export type SignDidPopupInput = DAppName & {
  plaintext: string;
  origin: string;
};

export interface SignDidPopupOutput {
  signature: string;
  did: string;
}
