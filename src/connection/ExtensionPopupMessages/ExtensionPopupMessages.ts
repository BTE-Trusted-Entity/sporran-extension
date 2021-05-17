import { disconnect, connect } from '@kiltprotocol/core';
import { browser, Runtime } from 'webextension-polyfill-ts';

const popup = 'popup';

export function connectToBackground(): void {
  browser.runtime.connect(undefined, { name: popup });
}

export async function extensionPopupListener(
  port: Runtime.Port,
): Promise<void> {
  if (port.name !== popup) {
    return;
  }
  port.onDisconnect.addListener(async function () {
    console.log(await disconnect());
  });
  console.log(await connect());
}
