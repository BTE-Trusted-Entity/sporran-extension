import { injectedClaimChannel } from './channels/ClaimChannels/injectedClaimChannel';
import { injectedSaveChannel } from './channels/SaveChannels/injectedSaveChannel';
import { injectedShareChannel } from './channels/ShareChannels/injectedShareChannel';
import { injectIntoDApp } from './dApps/injectIntoDApp/injectIntoDApp';
import { configuration } from './configuration/configuration';

async function showClaimPopup(values: { [key: string]: string }) {
  // Non-extension scripts cannot open windows with extension pages
  return injectedClaimChannel.get(values);
}

async function showSaveCredentialPopup(values: { [key: string]: string }) {
  // Non-extension scripts cannot open windows with extension pages
  return injectedSaveChannel.get(values);
}

async function showShareCredentialPopup(values: { [key: string]: string }) {
  // Non-extension scripts cannot open windows with extension pages
  return injectedShareChannel.get(values);
}

interface API {
  showClaimPopup: typeof showClaimPopup;
  showSaveCredentialPopup: typeof showSaveCredentialPopup;
  showShareCredentialPopup: typeof showShareCredentialPopup;
}

function main() {
  injectIntoDApp(configuration.version);

  if (!configuration.features.credentials || 'sporranExtension' in window) {
    return;
  }

  // Only injected scripts can create variables like this, content script cannot do this
  (window as unknown as { sporranExtension: API }).sporranExtension = {
    showClaimPopup,
    showSaveCredentialPopup,
    showShareCredentialPopup,
  };
}

main();
