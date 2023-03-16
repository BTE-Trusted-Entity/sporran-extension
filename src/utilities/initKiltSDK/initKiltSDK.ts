import { ConfigService, connect } from '@kiltprotocol/sdk-js';

import { getStoredEndpoint } from '../endpoints/endpoints';

export async function initKiltSDK(): Promise<void> {
  const address = await getStoredEndpoint();
  if (!ConfigService.isSet('api') || !ConfigService.get('api').isConnected) {
    await connect(address);
  }
}
