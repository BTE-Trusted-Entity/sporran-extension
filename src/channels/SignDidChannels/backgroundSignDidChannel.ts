import { PopupChannel } from '../base/PopupChannel/PopupChannel';
import { getAuthorizedOrigin } from '../../dApps/AccessChannels/getAuthorizedOrigin';

import { contentSignDidChannel } from './contentSignDidChannel';
import { SignDidPopupInput, SignDidPopupOutput } from './types';

export const backgroundSignDidChannel = new PopupChannel<
  SignDidPopupInput,
  SignDidPopupOutput
>('signDid');

export function initBackgroundSignDidChannel(): () => void {
  return contentSignDidChannel.produce(async (input, sender) => {
    const origin = await getAuthorizedOrigin(input, sender);
    return backgroundSignDidChannel.get({ ...input, origin }, sender);
  });
}
