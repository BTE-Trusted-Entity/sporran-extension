import { ConfigService } from '@kiltprotocol/sdk-js';

import { initKiltSDK } from '../../utilities/initKiltSDK/initKiltSDK';

export async function getGenesisHash(): Promise<string> {
  await initKiltSDK();
  const api = ConfigService.get('api');
  return api.genesisHash.toString();
}
