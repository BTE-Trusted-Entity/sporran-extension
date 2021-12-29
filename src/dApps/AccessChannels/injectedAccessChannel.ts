import { WindowChannel } from '../../channels/base/WindowChannel/WindowChannel';

import { AccessInput, AccessOutput } from './types';

export const injectedAccessChannel = new WindowChannel<
  Omit<AccessInput, 'origin'>,
  AccessOutput
>('access');
