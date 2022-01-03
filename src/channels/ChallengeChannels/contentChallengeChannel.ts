import { BrowserChannel } from '../base/BrowserChannel/BrowserChannel';
import { channelsEnum } from '../base/channelsEnum';

import { ChallengeInput, ChallengeOutput } from './types';

export const contentChallengeChannel = new BrowserChannel<
  ChallengeInput,
  ChallengeOutput
>(channelsEnum.challenge);
