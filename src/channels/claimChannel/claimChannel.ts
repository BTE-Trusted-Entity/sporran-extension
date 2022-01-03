import { PopupChannel } from '../base/PopupChannel/PopupChannel';
import { popupsEnum } from '../base/channelsEnum';

import { ClaimInput, ClaimOutput } from './types';

export const claimChannel = new PopupChannel<ClaimInput, ClaimOutput>(
  popupsEnum.claim,
);
