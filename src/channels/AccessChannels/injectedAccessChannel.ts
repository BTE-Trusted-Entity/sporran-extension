import { WindowChannel } from '../../channels/base/WindowChannel/WindowChannel';
import { popupsEnum } from '../../channels/base/channelsEnum';

import { AccessInput, AccessOutput } from './types';

export const injectedAccessChannel = new WindowChannel<
  AccessInput,
  AccessOutput
>(popupsEnum.access);
