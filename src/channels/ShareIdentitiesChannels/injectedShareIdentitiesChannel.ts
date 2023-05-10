import { popupsEnum } from '../base/channelsEnum';
import { WindowChannel } from '../base/WindowChannel/WindowChannel';

import { ShareIdentitiesInput, ShareIdentitiesOutput } from './types';

export const injectedShareIdentitiesChannel = new WindowChannel<
  ShareIdentitiesInput,
  ShareIdentitiesOutput
>(popupsEnum.shareIdentities);
