const type = 'sporranExtension.injectedScript';

function showClaimPopup(values: { [key: string]: string }) {
  // Non-extension scripts cannot open windows with extension pages
  window.postMessage(
    {
      type,
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

interface API {
  showClaimPopup: typeof showClaimPopup;
}

function main() {
  if ('sporranExtension' in window) {
    return;
  }
  // Only injected scripts can create variables like this, content script cannot do this
  ((window as unknown) as { sporranExtension: API }).sporranExtension = {
    showClaimPopup,
  };
}

main();
