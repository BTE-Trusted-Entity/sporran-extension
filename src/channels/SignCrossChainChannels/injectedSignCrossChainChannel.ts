import { WindowChannel } from '../base/WindowChannel/WindowChannel';
import { popupsEnum } from '../base/channelsEnum';

import { SignCrossChainInput, SignCrossChainOutput } from './types';

export const injectedSignCrossChainChannel = new WindowChannel<
  SignCrossChainInput,
  SignCrossChainOutput
>(popupsEnum.signCrossChain);
