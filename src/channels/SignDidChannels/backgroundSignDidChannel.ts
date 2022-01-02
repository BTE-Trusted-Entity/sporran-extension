import { PopupChannel } from '../base/PopupChannel/PopupChannel';
import { getAuthorizedOrigin } from '../../dApps/AccessChannels/getAuthorizedOrigin';

import { contentSignDidChannel } from './contentSignDidChannel';
import { SignDidOriginInput, SignDidOutput } from './types';

export const backgroundSignDidChannel = new PopupChannel<
  SignDidOriginInput,
  SignDidOutput
>('signDid');

export function initBackgroundSignDidChannel(): () => void {
  return contentSignDidChannel.produce(async (input, sender) => {
    const origin = await getAuthorizedOrigin(input, sender);
    return backgroundSignDidChannel.get({ ...input, origin }, sender);
  });
}
