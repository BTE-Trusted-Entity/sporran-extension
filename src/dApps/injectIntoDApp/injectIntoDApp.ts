import { injectExtension } from '@polkadot/extension-inject';

import { injectedAccessChannel } from '../AccessChannels/injectedAccessChannel';
import { IdentitiesInjectedAPI } from '../IdentitiesInjectedAPI/IdentitiesInjectedAPI';
import { SignerInjectedAPI } from '../SignerInjectedAPI/SignerInjectedAPI';
import { debounceAsync } from '../../utilities/debounceAsync/debounceAsync';

export const authenticate = debounceAsync<typeof injectedAccessChannel.get>(
  (input) => injectedAccessChannel.get(input),
);

export function injectIntoDApp(version: string): void {
  const sporranMeta = {
    name: 'Sporran', // manifest_name
    version,
  };

  injectExtension(async (unsafeDAppName: string) => {
    const dAppName = unsafeDAppName.substring(0, 50);
    await authenticate({ dAppName });

    return {
      accounts: new IdentitiesInjectedAPI(dAppName),
      signer: new SignerInjectedAPI(dAppName),
    };
  }, sporranMeta);
}
