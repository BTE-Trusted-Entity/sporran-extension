import { SignerPayloadJSON } from '@polkadot/types/types/extrinsic';
import { HexString } from '@polkadot/util/types';
import { injectedSignChannel } from '../SignChannels/injectedSignChannel';

export class SignerInjectedAPI {
  dAppName: string;

  constructor(name: string) {
    this.dAppName = name;
  }

  async signPayload(
    payload: SignerPayloadJSON,
  ): Promise<{ id: number; signature: HexString }> {
    return injectedSignChannel.get({
      dAppName: this.dAppName,
      payload,
    });
  }
}
