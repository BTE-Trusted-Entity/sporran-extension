import { WindowChannel } from '../base/WindowChannel/WindowChannel';

import { SignDidInput, SignDidOutput } from './types';

export const injectedSignDidChannel = new WindowChannel<
  SignDidInput,
  SignDidOutput
>('signDid');
