import { BrowserChannel } from '../base/BrowserChannel/BrowserChannel';
import { PopupChannel } from '../base/PopupChannel/PopupChannel';
import { injectedClaimChannel } from './injectedClaimChannel';
import { ClaimInput, ClaimOutput } from './types';

export const contentClaimChannel = new BrowserChannel<ClaimInput, ClaimOutput>(
  'claim',
);

export const backgroundClaimChannel = new PopupChannel<ClaimInput, ClaimOutput>(
  'claim',
);

export function initContentClaimChannel(): void {
  injectedClaimChannel.forward(contentClaimChannel);
}

export function initBackgroundClaimChannel(): void {
  contentClaimChannel.forward(backgroundClaimChannel);
}
