import { PopupChannel } from '../base/PopupChannel/PopupChannel';
import { popupsEnum } from '../base/channelsEnum';

import { RejectInput, RejectOutput } from './types';

export const rejectChannel = new PopupChannel<RejectInput, RejectOutput>(
  popupsEnum.reject,
);
