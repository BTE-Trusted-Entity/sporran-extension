import { WindowChannel } from '../../channels/base/WindowChannel/WindowChannel';

import { AccessInput, AccessOutput } from './types';

export const injectedAccessChannel = new WindowChannel<
  AccessInput,
  AccessOutput
>('access');
