import { BrowserChannel } from '../base/BrowserChannel/BrowserChannel';
import { channelsEnum } from '../base/channelsEnum';

import { CredentialInput, CredentialOutput } from './types';
import { injectedCredentialChannel } from './injectedCredentialChannel';

export const contentCredentialChannel = new BrowserChannel<
  CredentialInput,
  CredentialOutput
>(channelsEnum.credential);

export function initContentCredentialChannel(): void {
  injectedCredentialChannel.forward(contentCredentialChannel);
}
