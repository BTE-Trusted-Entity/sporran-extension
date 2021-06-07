import { BlockchainApiConnection } from '@kiltprotocol/chain-helpers';

import { genesisHashChannel } from './genesisHashChannel';

async function getGenesisHash() {
  const { api } = await BlockchainApiConnection.getConnectionOrConnect();

  return api.genesisHash.toString();
}

/*
 * Extracted to a separate file to prevent including SDK in the contentScript
 * */
export function initBackgroundGenesisHashChannel(): void {
  genesisHashChannel.produce(getGenesisHash);
}
