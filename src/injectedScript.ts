import {
  onPopupWindowResponse,
  sendPopupWindowRequest,
} from './connection/PopupWindowMessages/PopupWindowMessages';

let lastCallback: (values: { [key: string]: string }) => void | undefined;

function showClaimPopup(
  values: { [key: string]: string },
  callback: typeof lastCallback,
) {
  lastCallback = callback;

  // Non-extension scripts cannot open windows with extension pages
  sendPopupWindowRequest('claim', {
    // TODO: remove
    'Full Name': 'Ingo Rübe',
    Email: 'ingo@kilt.io',
    'Credential type': 'BL-Mail-Simple',
    Attester: 'BOTLabs',

    ...values,
  });
}

function showSaveCredentialPopup(values: { [key: string]: string }) {
  // Non-extension scripts cannot open windows with extension pages
  sendPopupWindowRequest('save', {
    // TODO: remove
    'Full Name': 'Ingo Rübe',
    Email: 'ingo@kilt.io',
    'Credential type': 'BL-Mail-Simple',
    Attester: 'BOTLabs',

    ...values,
  });
}

function showShareCredentialPopup(
  values: { [key: string]: string },
  callback: typeof lastCallback,
) {
  lastCallback = callback;

  // Non-extension scripts cannot open windows with extension pages
  sendPopupWindowRequest('share', values);
}

function handleResponse(data: Parameters<typeof lastCallback>[0]) {
  lastCallback?.(data);
}

interface API {
  showClaimPopup: typeof showClaimPopup;
  showSaveCredentialPopup: typeof showSaveCredentialPopup;
  showShareCredentialPopup: typeof showShareCredentialPopup;
}

function main() {
  if ('sporranExtension' in window) {
    return;
  }
  // Only injected scripts can create variables like this, content script cannot do this
  ((window as unknown) as { sporranExtension: API }).sporranExtension = {
    showClaimPopup,
    showSaveCredentialPopup,
    showShareCredentialPopup,
  };

  onPopupWindowResponse(handleResponse);
}

main();
