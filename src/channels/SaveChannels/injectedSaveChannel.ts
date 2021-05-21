import { WindowChannel } from '../base/WindowChannel/WindowChannel';
import { SaveInput, SaveOutput } from './types';

export const injectedSaveChannel = new WindowChannel<SaveInput, SaveOutput>(
  'save',
);
