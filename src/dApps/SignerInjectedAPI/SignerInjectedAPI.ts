import { SignerPayloadJSON } from '@polkadot/types/types/extrinsic';
import { injectedSignChannel } from '../SignChannels/injectedSignChannel';

export class SignerInjectedAPI {
  dAppName: string;

  constructor(name: string) {
    this.dAppName = name;
  }

  async signPayload(
    payload: SignerPayloadJSON,
  ): Promise<{ id: number; signature: string }> {
    return injectedSignChannel.get({
      dAppName: this.dAppName,
      payload,
    });
  }
}
