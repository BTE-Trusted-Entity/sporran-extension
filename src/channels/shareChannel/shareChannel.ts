import { PopupChannel } from '../base/PopupChannel/PopupChannel';
import { popupsEnum } from '../base/channelsEnum';

import { ShareInput, ShareOutput } from './types';

export const shareChannel = new PopupChannel<ShareInput, ShareOutput>(
  popupsEnum.share,
);
