let lastCallback: (values: { [key: string]: string }) => void | undefined;

function showClaimPopup(
  values: { [key: string]: string },
  callback: typeof lastCallback,
) {
  lastCallback = callback;

  // Non-extension scripts cannot open windows with extension pages
  window.postMessage(
    {
      type: 'sporranExtension.injectedScript.request',
      action: 'claim',

      // TODO: remove
      'Full Name': 'Ingo Rübe',
      Email: 'ingo@kilt.io',
      'Credential type': 'BL-Mail-Simple',
      Attester: 'BOTLabs',

      ...values,
    },
    window.location.href,
  );
}

function showSaveCredentialPopup(values: { [key: string]: string }) {
  // Non-extension scripts cannot open windows with extension pages
  window.postMessage(
    {
      type: 'sporranExtension.injectedScript.request',
      action: 'save',

      // TODO: remove
      'Full Name': 'Ingo Rübe',
      Email: 'ingo@kilt.io',
      'Credential type': 'BL-Mail-Simple',
      Attester: 'BOTLabs',

      ...values,
    },
    window.location.href,
  );
}

function onMessage(message: MessageEvent) {
  if (
    !lastCallback ||
    message.data.type !== 'sporranExtension.injectedScript.response'
  ) {
    return;
  }
  lastCallback(message.data);
}

interface API {
  showClaimPopup: typeof showClaimPopup;
  showSaveCredentialPopup: typeof showSaveCredentialPopup;
}

function main() {
  if ('sporranExtension' in window) {
    return;
  }
  // Only injected scripts can create variables like this, content script cannot do this
  ((window as unknown) as { sporranExtension: API }).sporranExtension = {
    showClaimPopup,
    showSaveCredentialPopup,
  };
  window.addEventListener('message', onMessage);
}

main();
