import { WindowChannel } from '../../channels/base/WindowChannel/WindowChannel';
import { popupsEnum } from '../../channels/base/channelsEnum';

import { SignInput, SignOutput } from './types';

export const injectedSignChannel = new WindowChannel<SignInput, SignOutput>(
  popupsEnum.sign,
);
