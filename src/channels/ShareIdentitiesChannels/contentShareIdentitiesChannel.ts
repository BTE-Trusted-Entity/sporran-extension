import { BrowserChannel } from '../base/BrowserChannel/BrowserChannel';
import { popupsEnum } from '../base/channelsEnum';

import { ShareIdentitiesInput, ShareIdentitiesOutput } from './types';

export const contentShareIdentitiesChannel = new BrowserChannel<
  ShareIdentitiesInput,
  ShareIdentitiesOutput
>(popupsEnum.shareIdentities);
