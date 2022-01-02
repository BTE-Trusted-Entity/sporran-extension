import { PopupChannel } from '../../channels/base/PopupChannel/PopupChannel';
import { getAuthorizedOrigin } from '../AccessChannels/getAuthorizedOrigin';

import { contentSignRawChannel } from './contentSignRawChannel';
import { SignRawOriginInput, SignRawOutput } from './types';

export const backgroundSignRawChannel = new PopupChannel<
  SignRawOriginInput,
  SignRawOutput
>('signRaw');

let id = 0;

export function initBackgroundSignRawChannel(): void {
  contentSignRawChannel.produce(async (input, sender) => {
    const origin = await getAuthorizedOrigin(input, sender);
    return backgroundSignRawChannel.get(
      {
        ...input,
        origin,
        id: ++id,
      },
      sender,
    );
  });
}
