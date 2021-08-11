import { PopupChannel } from '../base/PopupChannel/PopupChannel';
import { ClaimInput, ClaimOutput } from './types';

export const claimChannel = new PopupChannel<ClaimInput, ClaimOutput>('claim');
