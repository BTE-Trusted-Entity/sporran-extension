import { BlockchainApiConnection } from '@kiltprotocol/chain-helpers';

export async function hasVestedFunds(address: string): Promise<boolean> {
  const { api } = await BlockchainApiConnection.getConnectionOrConnect();
  const { isSome } = await api.query.vesting.vesting(address);
  return isSome;
}
