import { ConfigService } from '@kiltprotocol/sdk-js';

import { initKiltSDK } from '../initKiltSDK/initKiltSDK';

export async function whichChain() {
  await initKiltSDK();

  const api = ConfigService.get('api');

  const chainName = (await api.rpc.system.chain()).toHuman();

  console.log('Sporran is connected to a node of the blockchain: ', chainName);

  return chainName;
}
