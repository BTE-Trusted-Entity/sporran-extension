import { SignerPayloadJSON } from '@polkadot/types/types/extrinsic';
import { getSignPopupResult } from '../SignPopupMessages/SignPopupMessages';

export class SignerInjectedAPI {
  dAppName: string;

  constructor(name: string) {
    this.dAppName = name;
  }

  async signPayload(
    payload: SignerPayloadJSON,
  ): Promise<{ id: number; signature: string }> {
    return getSignPopupResult({
      dAppName: this.dAppName,
      payload,
    });
  }
}
