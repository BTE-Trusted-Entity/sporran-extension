import { BlockchainApiConnection } from '@kiltprotocol/chain-helpers';

export async function getGenesisHash(): Promise<string> {
  const { api } = await BlockchainApiConnection.getConnectionOrConnect();

  return api.genesisHash.toString();
}
