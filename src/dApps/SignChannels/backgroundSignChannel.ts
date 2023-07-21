import { Runtime } from 'webextension-polyfill';

import { PopupChannel } from '../../channels/base/PopupChannel/PopupChannel';
import { getAuthorizedOrigin } from '../AccessChannels/getAuthorizedOrigin';
import { popupsEnum } from '../../channels/base/channelsEnum';

import { SignInput, SignOriginInput, SignOutput } from './types';

export const backgroundSignChannel = new PopupChannel<
  SignOriginInput,
  SignOutput
>(popupsEnum.sign);

let id = 0;

export async function getSignResult(
  input: SignInput,
  sender: Runtime.MessageSender,
): Promise<SignOutput> {
  const origin = await getAuthorizedOrigin(input, sender);
  return backgroundSignChannel.get(
    {
      ...input,
      origin,
      id: ++id,
    },
    sender,
  );
}
