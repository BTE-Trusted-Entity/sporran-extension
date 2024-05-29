import { Blockchain, ConfigService, connect } from '@kiltprotocol/sdk-js';

import { getStoredEndpoint } from '../endpoints/endpoints';
import { configuration } from '../../configuration/configuration';

export async function initKiltSDK(): Promise<void> {
  const address = await getStoredEndpoint();
  if (!ConfigService.isSet('api') || !ConfigService.get('api').isConnected) {
    await connect(address as any);
  }

  if (!configuration.features.finalized) {
    ConfigService.set({ submitTxResolveOn: Blockchain.IS_IN_BLOCK });
  }
}
