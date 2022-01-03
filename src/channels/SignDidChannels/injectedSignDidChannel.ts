import { WindowChannel } from '../base/WindowChannel/WindowChannel';
import { popupsEnum } from '../base/channelsEnum';

import { SignDidInput, SignDidOutput } from './types';

export const injectedSignDidChannel = new WindowChannel<
  SignDidInput,
  SignDidOutput
>(popupsEnum.signDid);
