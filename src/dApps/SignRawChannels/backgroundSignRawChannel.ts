import { Runtime } from 'webextension-polyfill';

import { PopupChannel } from '../../channels/base/PopupChannel/PopupChannel';
import { getAuthorizedOrigin } from '../AccessChannels/getAuthorizedOrigin';
import { popupsEnum } from '../../channels/base/channelsEnum';

import { SignRawInput, SignRawOriginInput, SignRawOutput } from './types';

export const backgroundSignRawChannel = new PopupChannel<
  SignRawOriginInput,
  SignRawOutput
>(popupsEnum.signRaw);

let id = 0;

export async function getSignRawResult(
  input: SignRawInput,
  sender: Runtime.MessageSender,
): Promise<SignRawOutput> {
  const origin = await getAuthorizedOrigin(input, sender);
  return backgroundSignRawChannel.get(
    {
      ...input,
      origin,
      id: ++id,
    },
    sender,
  );
}
