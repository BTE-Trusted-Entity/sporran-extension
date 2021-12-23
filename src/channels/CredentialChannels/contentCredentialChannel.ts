import { BrowserChannel } from '../base/BrowserChannel/BrowserChannel';

import { CredentialInput, CredentialOutput } from './types';
import { injectedCredentialChannel } from './injectedCredentialChannel';

export const contentCredentialChannel = new BrowserChannel<
  CredentialInput,
  CredentialOutput
>('credential');

export function initContentCredentialChannel(): void {
  injectedCredentialChannel.forward(contentCredentialChannel);
}
