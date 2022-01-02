import { WindowChannel } from '../../channels/base/WindowChannel/WindowChannel';

import { SignRawInput, SignRawOutput } from './types';

export const injectedSignRawChannel = new WindowChannel<
  SignRawInput,
  SignRawOutput
>('signRaw');
