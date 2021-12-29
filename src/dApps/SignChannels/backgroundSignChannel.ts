import { PopupChannel } from '../../channels/base/PopupChannel/PopupChannel';
import { checkAccess } from '../AccessChannels/backgroundAccessChannels';

import { contentSignChannel } from './contentSignChannel';
import { SignPopupInput, SignPopupOutput } from './types';

export const backgroundSignChannel = new PopupChannel<
  SignPopupInput,
  SignPopupOutput
>('sign');

let id = 0;

export function initBackgroundSignChannel(): void {
  contentSignChannel.produce(async (input, sender) => {
    await checkAccess(input, sender);
    return backgroundSignChannel.get(
      {
        ...input,
        id: ++id,
      },
      sender,
    );
  });
}
