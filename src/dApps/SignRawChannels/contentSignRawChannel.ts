import { BrowserChannel } from '../../channels/base/BrowserChannel/BrowserChannel';
import { popupsEnum } from '../../channels/base/channelsEnum';

import { SignRawInput, SignRawOutput } from './types';

export const contentSignRawChannel = new BrowserChannel<
  SignRawInput,
  SignRawOutput
>(popupsEnum.signRaw);
