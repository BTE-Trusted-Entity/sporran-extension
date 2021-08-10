import { PopupChannel } from '../base/PopupChannel/PopupChannel';
import { ClaimInput, ClaimOutput } from './types';

export const backgroundClaimChannel = new PopupChannel<ClaimInput, ClaimOutput>(
  'claim',
);
