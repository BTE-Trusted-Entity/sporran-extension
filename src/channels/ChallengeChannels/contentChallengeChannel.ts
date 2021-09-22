import { BrowserChannel } from '../base/BrowserChannel/BrowserChannel';
import { injectedChallengeChannel } from './injectedChallengeChannel';
import { ChallengeInput, ChallengeOutput } from './types';

export const contentChallengeChannel = new BrowserChannel<
  ChallengeInput,
  ChallengeOutput
>('challenge');

export function initContentChallengeChannel(): void {
  injectedChallengeChannel.forward(contentChallengeChannel);
}
