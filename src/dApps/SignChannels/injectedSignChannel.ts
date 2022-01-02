import { WindowChannel } from '../../channels/base/WindowChannel/WindowChannel';

import { SignInput, SignOutput } from './types';

export const injectedSignChannel = new WindowChannel<
  Omit<SignInput, 'origin'>,
  SignOutput
>('sign');
