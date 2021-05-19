import { SignerPayloadJSON } from '@polkadot/types/types/extrinsic';
import { getSignPopupWindowResult } from '../SignPopupWindowMessages/SignPopupWindowMessages';

export class SignerInjectedAPI {
  dAppName: string;

  constructor(name: string) {
    this.dAppName = name;
  }

  async signPayload(
    payload: SignerPayloadJSON,
  ): Promise<{ id: number; signature: string }> {
    return getSignPopupWindowResult({
      dAppName: this.dAppName,
      payload,
    });
  }
}
