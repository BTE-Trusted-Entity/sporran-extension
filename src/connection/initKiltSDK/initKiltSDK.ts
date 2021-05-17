import { init } from '@kiltprotocol/core';

import { getEndpoint } from '../../utilities/endpoints/endpoints';

export function initKiltSDK(): void {
  (async () => {
    const address = await getEndpoint();
    await init({ address });
  })();
}
