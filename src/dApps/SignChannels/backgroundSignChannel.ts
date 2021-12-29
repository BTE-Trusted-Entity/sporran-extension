import { PopupChannel } from '../../channels/base/PopupChannel/PopupChannel';

import { contentSignChannel } from './contentSignChannel';
import { SignPopupInput, SignPopupOutput } from './types';

export const backgroundSignChannel = new PopupChannel<
  SignPopupInput,
  SignPopupOutput
>('sign');

let id = 0;

export function initBackgroundSignChannel(): void {
  contentSignChannel.produce((input, sender) =>
    backgroundSignChannel.get(
      {
        ...input,
        id: ++id,
      },
      sender,
    ),
  );
}
