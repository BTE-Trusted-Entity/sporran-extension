import { WindowChannel } from '../base/WindowChannel/WindowChannel';
import { channelsEnum } from '../base/channelsEnum';

import { CredentialInput, CredentialOutput } from './types';

export const injectedCredentialChannel = new WindowChannel<
  CredentialInput,
  CredentialOutput
>(channelsEnum.credential);
