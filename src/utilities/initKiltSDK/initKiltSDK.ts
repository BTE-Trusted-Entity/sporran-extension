import { init } from '@kiltprotocol/core';

export async function initKiltSDK(): Promise<void> {
  await init();
}
