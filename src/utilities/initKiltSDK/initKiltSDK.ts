import { ConfigService } from '@kiltprotocol/config';
import { connect } from '@kiltprotocol/core';

import { getEndpoint } from '../endpoints/endpoints';

export async function initKiltSDK(): Promise<void> {
  const address = await getEndpoint();
  if (!ConfigService.isSet('api') || !ConfigService.get('api').isConnected) {
    await connect(address);
  }
}
