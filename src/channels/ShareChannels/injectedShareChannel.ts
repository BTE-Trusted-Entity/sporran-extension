import { WindowChannel } from '../base/WindowChannel/WindowChannel';
import { ShareInput, ShareOutput } from './types';

export const injectedShareChannel = new WindowChannel<ShareInput, ShareOutput>(
  'share',
);
