import { injectExtension } from '@polkadot/extension-inject';

import { injectedAccessChannel } from '../AccessChannels/injectedAccessChannel';
import { AccountsInjectedAPI } from '../AccountsInjectedAPI/AccountsInjectedAPI';
import { SignerInjectedAPI } from '../SignerInjectedAPI/SignerInjectedAPI';

export function injectIntoDApp(): void {
  const sporranMeta = {
    name: 'Sporran', // manifest_name
    version: '1.0.0', // TODO: version
  };

  injectExtension(async (dAppName: string) => {
    await injectedAccessChannel.get({ dAppName });

    return {
      accounts: new AccountsInjectedAPI(dAppName),
      signer: new SignerInjectedAPI(dAppName),
    };
  }, sporranMeta);
}
