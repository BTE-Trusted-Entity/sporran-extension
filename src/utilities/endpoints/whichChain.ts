import { ConfigService } from '@kiltprotocol/sdk-js';

export async function whichChain() {
  const api = ConfigService.get('api');

  const chainName = (await api.rpc.system.chain()).toHuman();

  console.log('Sporran is connected to a node of the blockchain: ', chainName);

  return chainName;
}
