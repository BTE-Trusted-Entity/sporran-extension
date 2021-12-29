import { PopupChannel } from '../../channels/base/PopupChannel/PopupChannel';
import { getAuthorizedOrigin } from '../AccessChannels/getAuthorizedOrigin';

import { contentSignChannel } from './contentSignChannel';
import { SignPopupInput, SignPopupOutput } from './types';

export const backgroundSignChannel = new PopupChannel<
  SignPopupInput,
  SignPopupOutput
>('sign');

let id = 0;

export function initBackgroundSignChannel(): void {
  contentSignChannel.produce(async (input, sender) => {
    const origin = await getAuthorizedOrigin(input, sender);
    return backgroundSignChannel.get(
      {
        ...input,
        origin,
        id: ++id,
      },
      sender,
    );
  });
}
