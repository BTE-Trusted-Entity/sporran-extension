import { Runtime } from 'webextension-polyfill-ts';

export interface Origin {
  origin: string;
}

export function getOrigin(sender: Runtime.MessageSender): string {
  const url = sender.tab?.url;
  if (!url) {
    throw new Error('Unknown origin');
  }
  return new URL(url).host;
}
