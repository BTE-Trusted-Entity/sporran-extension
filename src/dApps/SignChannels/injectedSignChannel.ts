import { WindowChannel } from '../../channels/base/WindowChannel/WindowChannel';

import { SignPopupInput, SignPopupOutput } from './types';

export const injectedSignChannel = new WindowChannel<
  Omit<SignPopupInput, 'origin'>,
  SignPopupOutput
>('sign');
