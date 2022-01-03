import { WindowChannel } from '../../channels/base/WindowChannel/WindowChannel';
import { channelsEnum } from '../../channels/base/channelsEnum';

import { IdentitiesInput, IdentitiesOutput } from './types';

export const injectedIdentitiesChannel = new WindowChannel<
  IdentitiesInput,
  IdentitiesOutput
>(channelsEnum.identities);
