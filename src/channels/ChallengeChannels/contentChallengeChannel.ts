import { BrowserChannel } from '../base/BrowserChannel/BrowserChannel';
import { channelsEnum } from '../base/channelsEnum';

import { injectedChallengeChannel } from './injectedChallengeChannel';
import { ChallengeInput, ChallengeOutput } from './types';

export const contentChallengeChannel = new BrowserChannel<
  ChallengeInput,
  ChallengeOutput
>(channelsEnum.challenge);

export function initContentChallengeChannel(): void {
  injectedChallengeChannel.forward(contentChallengeChannel);
}
