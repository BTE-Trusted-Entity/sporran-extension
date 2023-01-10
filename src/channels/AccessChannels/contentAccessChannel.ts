import { BrowserChannel } from '../base/BrowserChannel/BrowserChannel';
import { popupsEnum } from '../base/channelsEnum';

import { AccessInput, AccessOutput } from './types';

export const contentAccessChannel = new BrowserChannel<
  AccessInput,
  AccessOutput
>(popupsEnum.access);
