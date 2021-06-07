import { BrowserChannel } from '../../channels/base/BrowserChannel/BrowserChannel';

type GenesisHashInput = void;

type GenesisHashOutput = string;

export const genesisHashChannel = new BrowserChannel<
  GenesisHashInput,
  GenesisHashOutput
>('genesisHash');
