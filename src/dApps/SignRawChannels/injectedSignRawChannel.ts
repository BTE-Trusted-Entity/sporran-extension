import { WindowChannel } from '../../channels/base/WindowChannel/WindowChannel';

import { SignRawPopupInput, SignRawPopupOutput } from './types';

export const injectedSignRawChannel = new WindowChannel<
  Omit<SignRawPopupInput, 'origin'>,
  SignRawPopupOutput
>('signRaw');
