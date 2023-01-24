import { popupsEnum } from '../base/channelsEnum';
import { WindowChannel } from '../base/WindowChannel/WindowChannel';

import { ASUserDataInput, ASUserDataOutput } from './types';

export const injectedASUserDataChannel = new WindowChannel<
  ASUserDataInput,
  ASUserDataOutput
>(popupsEnum.ASUserData);
