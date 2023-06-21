import { BrowserChannel } from '../base/BrowserChannel/BrowserChannel';
import { popupsEnum } from '../base/channelsEnum';

import { SignCrossChainInput, SignCrossChainOutput } from './types';

export const contentSignCrossChainChannel = new BrowserChannel<
  SignCrossChainInput,
  SignCrossChainOutput
>(popupsEnum.signCrossChain);
