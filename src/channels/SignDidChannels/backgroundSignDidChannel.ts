import { PopupChannel } from '../base/PopupChannel/PopupChannel';
import { getAuthorizedOrigin } from '../../dApps/AccessChannels/getAuthorizedOrigin';
import { popupsEnum } from '../base/channelsEnum';

import { contentSignDidChannel } from './contentSignDidChannel';
import { SignDidOriginInput, SignDidOutput } from './types';

export const backgroundSignDidChannel = new PopupChannel<
  SignDidOriginInput,
  SignDidOutput
>(popupsEnum.signDid);

export function initBackgroundSignDidChannel(): () => void {
  return contentSignDidChannel.produce(async (input, sender) => {
    const origin = await getAuthorizedOrigin(input, sender);
    return backgroundSignDidChannel.get({ ...input, origin }, sender);
  });
}
