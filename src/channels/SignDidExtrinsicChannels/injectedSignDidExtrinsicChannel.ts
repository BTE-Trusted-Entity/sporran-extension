import { WindowChannel } from '../base/WindowChannel/WindowChannel';
import { popupsEnum } from '../base/channelsEnum';

import { SignDidExtrinsicInput, SignDidExtrinsicOutput } from './types';

export const injectedSignDidExtrinsicChannel = new WindowChannel<
  SignDidExtrinsicInput,
  SignDidExtrinsicOutput
>(popupsEnum.signDidExtrinsic);
