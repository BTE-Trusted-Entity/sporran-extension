import { injectExtension } from '@polkadot/extension-inject';

import { getAccessResult } from '../AccessMessages/AccessMessages';
import { AccountsInjectedAPI } from '../AccountsInjectedAPI/AccountsInjectedAPI';

export function injectIntoDApp(): void {
  const sporranMeta = {
    name: 'Sporran', // manifest_name
    version: '1.0.0', // TODO: version
  };

  injectExtension(async (dAppName: string) => {
    const { authorized } = await getAccessResult({ dAppName });
    if (!authorized) {
      throw new Error('Not authorized');
    }

    return {
      accounts: new AccountsInjectedAPI(dAppName),
      signer: {},
    };
  }, sporranMeta);
}
