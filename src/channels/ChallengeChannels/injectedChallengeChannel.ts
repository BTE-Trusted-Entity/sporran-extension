import { WindowChannel } from '../base/WindowChannel/WindowChannel';
import { channelsEnum } from '../base/channelsEnum';

import { ChallengeInput, ChallengeOutput } from './types';

export const injectedChallengeChannel = new WindowChannel<
  ChallengeInput,
  ChallengeOutput
>(channelsEnum.challenge);
