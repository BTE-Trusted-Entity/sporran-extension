import { BrowserChannel } from '../../channels/base/BrowserChannel/BrowserChannel';
import { popupsEnum } from '../../channels/base/channelsEnum';

import { SignInput, SignOutput } from './types';

export const contentSignChannel = new BrowserChannel<SignInput, SignOutput>(
  popupsEnum.sign,
);
