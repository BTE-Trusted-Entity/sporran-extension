import { disconnect, connect } from '@kiltprotocol/core';
import { browser, Runtime } from 'webextension-polyfill-ts';

const name = 'popup';

export function connectToBackground(): void {
  browser.runtime.connect(undefined, { name });
}

export async function extensionPopupListener(
  port: Runtime.Port,
): Promise<void> {
  if (port.name !== name) {
    return;
  }
  port.onDisconnect.addListener(async function () {
    await disconnect();
  });
  await connect();
}
