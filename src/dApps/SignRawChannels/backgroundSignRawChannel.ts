import { PopupChannel } from '../../channels/base/PopupChannel/PopupChannel';
import { checkAccess } from '../AccessChannels/backgroundAccessChannels';

import { contentSignRawChannel } from './contentSignRawChannel';
import { SignRawPopupInput, SignRawPopupOutput } from './types';

export const backgroundSignRawChannel = new PopupChannel<
  SignRawPopupInput,
  SignRawPopupOutput
>('signRaw');

let id = 0;

export function initBackgroundSignRawChannel(): void {
  contentSignRawChannel.produce(async (input, sender) => {
    await checkAccess(input, sender);
    return backgroundSignRawChannel.get(
      {
        ...input,
        id: ++id,
      },
      sender,
    );
  });
}
