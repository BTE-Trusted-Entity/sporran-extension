import { PopupChannel } from '../base/PopupChannel/PopupChannel';
import { SaveInput, SaveOutput } from './types';

export const backgroundSaveChannel = new PopupChannel<SaveInput, SaveOutput>(
  'save',
);
