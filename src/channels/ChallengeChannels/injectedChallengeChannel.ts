import { WindowChannel } from '../base/WindowChannel/WindowChannel';
import { ChallengeInput, ChallengeOutput } from './types';

export const injectedChallengeChannel = new WindowChannel<
  ChallengeInput,
  ChallengeOutput
>('challenge');
