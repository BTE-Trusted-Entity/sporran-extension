import { BrowserChannel } from '../base/BrowserChannel/BrowserChannel';
import { popupsEnum } from '../base/channelsEnum';

import { ASUserDataInput, ASUserDataOutput } from './types';

export const contentASUserDataChannel = new BrowserChannel<
  ASUserDataInput,
  ASUserDataOutput
>(popupsEnum.ASUserData);
