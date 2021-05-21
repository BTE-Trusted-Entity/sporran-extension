import { WindowChannel } from '../../channels/base/WindowChannel/WindowChannel';

interface AccessInput {
  dAppName: string;
}

interface AccessOutput {
  authorized?: boolean;
}

export const injectedAccessChannel = new WindowChannel<
  AccessInput,
  AccessOutput
>('access');
