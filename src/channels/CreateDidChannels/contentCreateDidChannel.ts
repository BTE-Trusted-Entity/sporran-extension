import { BrowserChannel } from '../base/BrowserChannel/BrowserChannel';
import { popupsEnum } from '../base/channelsEnum';

import { CreateDidInput, CreateDidOutput } from './types';

export const contentCreateDidChannel = new BrowserChannel<
  CreateDidInput,
  CreateDidOutput
>(popupsEnum.createDid);
