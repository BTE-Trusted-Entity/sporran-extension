import { init } from '@kiltprotocol/core';

export function initBlockChainConnection(): void {
  (async () => {
    // TODO: move address to config file
    await init({ address: 'wss://full-nodes.kilt.io:9944' });
  })();
}
