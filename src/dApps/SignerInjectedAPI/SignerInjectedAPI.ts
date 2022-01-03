import {
  SignerPayloadJSON,
  SignerPayloadRaw,
  SignerResult,
} from '@polkadot/types/types/extrinsic';

import { injectedSignChannel } from '../SignChannels/injectedSignChannel';
import { injectedSignRawChannel } from '../SignRawChannels/injectedSignRawChannel';

export class SignerInjectedAPI {
  dAppName: string;

  constructor(name: string) {
    this.dAppName = name;

    this.signPayload = this.signPayload.bind(this);
    this.signRaw = this.signRaw.bind(this);
  }

  async signPayload(payload: SignerPayloadJSON): Promise<SignerResult> {
    return injectedSignChannel.get({
      dAppName: this.dAppName,
      id: 0,
      ...payload,
    });
  }

  async signRaw(payload: SignerPayloadRaw): Promise<SignerResult> {
    return injectedSignRawChannel.get({
      dAppName: this.dAppName,
      id: 0,
      ...payload,
    });
  }
}
