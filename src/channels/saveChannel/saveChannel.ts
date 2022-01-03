import { PopupChannel } from '../base/PopupChannel/PopupChannel';
import { popupsEnum } from '../base/channelsEnum';

import { SaveInput, SaveOutput } from './types';

export const saveChannel = new PopupChannel<SaveInput, SaveOutput>(
  popupsEnum.save,
);
