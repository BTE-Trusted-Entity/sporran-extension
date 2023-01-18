import { BrowserChannel } from '../base/BrowserChannel/BrowserChannel';
import { popupsEnum } from '../base/channelsEnum';

import { SignDidExtrinsicInput, SignDidExtrinsicOutput } from './types';

export const contentSignDidExtrinsicChannel = new BrowserChannel<
  SignDidExtrinsicInput,
  SignDidExtrinsicOutput
>(popupsEnum.signDidExtrinsic);
