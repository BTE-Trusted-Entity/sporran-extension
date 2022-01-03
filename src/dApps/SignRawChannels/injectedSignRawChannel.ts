import { WindowChannel } from '../../channels/base/WindowChannel/WindowChannel';
import { popupsEnum } from '../../channels/base/channelsEnum';

import { SignRawInput, SignRawOutput } from './types';

export const injectedSignRawChannel = new WindowChannel<
  SignRawInput,
  SignRawOutput
>(popupsEnum.signRaw);
