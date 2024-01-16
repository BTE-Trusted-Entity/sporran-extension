import { ConfigService, connect } from '@kiltprotocol/sdk-js';
import { Blockchain } from '@kiltprotocol/chain-helpers';

import { getStoredEndpoint } from '../endpoints/endpoints';
import { configuration } from '../../configuration/configuration';

export async function initKiltSDK(): Promise<void> {
  const address = await getStoredEndpoint();
  if (!ConfigService.isSet('api') || !ConfigService.get('api').isConnected) {
    await connect(address);
  }

  if (!configuration.features.finalized) {
    ConfigService.set({ submitTxResolveOn: Blockchain.IS_IN_BLOCK });
  }
}
