import { WindowChannel } from '../../channels/base/WindowChannel/WindowChannel';

interface AccessInput {
  dAppName: string;
}

type AccessOutput = void;

export const injectedAccessChannel = new WindowChannel<
  AccessInput,
  AccessOutput
>('access');
