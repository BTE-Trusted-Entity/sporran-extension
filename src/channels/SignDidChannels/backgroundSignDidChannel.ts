import { PopupChannel } from '../base/PopupChannel/PopupChannel';

import { contentSignDidChannel } from './contentSignDidChannel';
import { SignDidPopupInput, SignDidPopupOutput } from './types';

export const backgroundSignDidChannel = new PopupChannel<
  SignDidPopupInput,
  SignDidPopupOutput
>('signDid');

export function initBackgroundSignDidChannel(): () => void {
  return contentSignDidChannel.forward(backgroundSignDidChannel);
}
