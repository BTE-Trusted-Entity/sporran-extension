import { PopupChannel } from '../../channels/base/PopupChannel/PopupChannel';
import { popupsEnum } from '../../channels/base/channelsEnum';

import { AccessInput } from './types';
import { Origin } from './Origin';

export const backgroundAccessChannel = new PopupChannel<
  AccessInput & Origin,
  boolean
>(popupsEnum.access);
