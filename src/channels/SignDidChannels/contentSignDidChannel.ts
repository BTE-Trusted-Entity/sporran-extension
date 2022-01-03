import { BrowserChannel } from '../base/BrowserChannel/BrowserChannel';
import { popupsEnum } from '../base/channelsEnum';

import { SignDidInput, SignDidOutput } from './types';

export const contentSignDidChannel = new BrowserChannel<
  SignDidInput,
  SignDidOutput
>(popupsEnum.signDid);
