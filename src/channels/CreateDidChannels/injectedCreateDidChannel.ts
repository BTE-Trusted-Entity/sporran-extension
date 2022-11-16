import { popupsEnum } from '../base/channelsEnum';
import { WindowChannel } from '../base/WindowChannel/WindowChannel';

import { CreateDidInput, CreateDidOutput } from './types';

export const injectedCreateDidChannel = new WindowChannel<
  CreateDidInput,
  CreateDidOutput
>(popupsEnum.createDid);
