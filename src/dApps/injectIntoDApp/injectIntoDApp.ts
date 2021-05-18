import { injectExtension } from '@polkadot/extension-inject';

import { getAccessResult } from '../AccessMessages/AccessMessages';
import { AccountsInjectedAPI } from '../AccountsInjectedAPI/AccountsInjectedAPI';

export function injectIntoDApp(): void {
  const sporranMeta = {
    name: 'Sporran', // manifest_name
    version: '1.0.0', // TODO: version
  };

  injectExtension(async (name: string) => {
    const { authorized } = await getAccessResult({ name });
    if (!authorized) {
      throw new Error('Not authorized');
    }

    return {
      accounts: new AccountsInjectedAPI(name),
      signer: {},
    };
  }, sporranMeta);
}
