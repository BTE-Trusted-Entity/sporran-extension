import { WindowChannel } from '../../channels/base/WindowChannel/WindowChannel';

import { IdentitiesInput, IdentitiesOutput } from './types';

export const injectedIdentitiesChannel = new WindowChannel<
  IdentitiesInput,
  IdentitiesOutput
>('identities');
