import { Blockchain, ConfigService, connect } from '@kiltprotocol/sdk-js';

import { getEndpoint } from '../endpoints/endpoints';
import { configuration } from '../../configuration/configuration';

export async function initKiltSDK(): Promise<void> {
  const address = await getEndpoint();
  if (!ConfigService.isSet('api') || !ConfigService.get('api').isConnected) {
    await connect(address);
  }

  if (!configuration.features.finalized) {
    ConfigService.set({ submitTxResolveOn: Blockchain.IS_IN_BLOCK });
  }
}
