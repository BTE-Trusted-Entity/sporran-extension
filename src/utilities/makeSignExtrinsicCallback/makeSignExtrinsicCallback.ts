import {
  KiltKeyringPair,
  SignExtrinsicCallback,
  SignRequestData,
} from '@kiltprotocol/types';

export function makeSignExtrinsicCallback(
  keypair: KiltKeyringPair,
): SignExtrinsicCallback {
  return async function sign({ data }: SignRequestData) {
    return {
      signature: keypair.sign(data, { withType: false }),
      keyType: keypair.type,
    };
  };
}
