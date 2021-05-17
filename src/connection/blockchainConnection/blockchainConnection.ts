import { init, connect, disconnect } from '@kiltprotocol/core';
import { Runtime } from 'webextension-polyfill-ts';

import { getEndpoint } from '../../utilities/endpoints/endpoints';

export function initBlockChainConnection(): void {
  (async () => {
    const address = await getEndpoint();
    await init({ address });
  })();
}

export async function extensionPopupListener(
  port: Runtime.Port,
): Promise<void> {
  if (port.name !== 'popup') {
    return;
  }
  port.onDisconnect.addListener(async function () {
    await disconnect();
  });
  await connect();
}
