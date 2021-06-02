import { WindowChannel } from '../base/WindowChannel/WindowChannel';
import { ClaimInput, ClaimOutput } from './types';

export const injectedClaimChannel = new WindowChannel<ClaimInput, ClaimOutput>(
  'claim',
);
