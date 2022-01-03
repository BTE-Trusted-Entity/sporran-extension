import { BrowserChannel } from '../../channels/base/BrowserChannel/BrowserChannel';
import { popupsEnum } from '../../channels/base/channelsEnum';

import { AccessInput, AccessOutput } from './types';

export const contentAccessChannel = new BrowserChannel<
  AccessInput,
  AccessOutput
>(popupsEnum.access);
