import { PopupChannel } from '../../channels/base/PopupChannel/PopupChannel';
import { getAuthorizedOrigin } from '../AccessChannels/getAuthorizedOrigin';
import { popupsEnum } from '../../channels/base/channelsEnum';

import { contentSignChannel } from './contentSignChannel';
import { SignOriginInput, SignOutput } from './types';

export const backgroundSignChannel = new PopupChannel<
  SignOriginInput,
  SignOutput
>(popupsEnum.sign);

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
