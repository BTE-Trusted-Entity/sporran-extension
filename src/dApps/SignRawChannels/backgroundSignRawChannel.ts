import { SignerResult } from '@polkadot/types/types/extrinsic';

import { PopupChannel } from '../../channels/base/PopupChannel/PopupChannel';

import { contentSignRawChannel } from './contentSignRawChannel';

interface SignBgInput {
  origin: string;
  address: string;
  data: string;
  id: number;
}

type SignBgOutput = SignerResult;

export const backgroundSignRawChannel = new PopupChannel<
  SignBgInput,
  SignBgOutput
>('signRaw');

let id = 0;

export function initBackgroundSignRawChannel(): void {
  contentSignRawChannel.produce(async (input, sender) =>
    backgroundSignRawChannel.get(
      {
        ...input,
        id: ++id,
      },
      sender,
    ),
  );
}
