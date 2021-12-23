import { WindowChannel } from '../base/WindowChannel/WindowChannel';

import { CredentialInput, CredentialOutput } from './types';

export const injectedCredentialChannel = new WindowChannel<
  CredentialInput,
  CredentialOutput
>('credential');
