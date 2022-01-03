import { BrowserChannel } from '../../channels/base/BrowserChannel/BrowserChannel';
import { channelsEnum } from '../../channels/base/channelsEnum';

type GenesisHashInput = void;

type GenesisHashOutput = string;

export const genesisHashChannel = new BrowserChannel<
  GenesisHashInput,
  GenesisHashOutput
>(channelsEnum.genesisHash);
