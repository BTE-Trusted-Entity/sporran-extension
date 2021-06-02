import { PopupChannel } from '../../channels/base/PopupChannel/PopupChannel';
import { BrowserChannel } from '../../channels/base/BrowserChannel/BrowserChannel';

export interface AccessInput {
  name: string;
  origin: string;
}

interface AccessOutput {
  authorized?: string;
}

export const contentAccessChannel = new BrowserChannel<
  AccessInput,
  AccessOutput
>('access');

export const backgroundAccessChannel = new PopupChannel<
  AccessInput,
  AccessOutput
>('authorize');

export function initBackgroundAccessChannel(): void {
  contentAccessChannel.forward(backgroundAccessChannel);
}
