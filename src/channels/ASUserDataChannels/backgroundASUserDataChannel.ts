import { Runtime } from 'webextension-polyfill-ts';

import { popupsEnum } from '../base/channelsEnum';
import { PopupChannel } from '../base/PopupChannel/PopupChannel';
import { getAuthorizedOrigin } from '../AccessChannels/getAuthorizedOrigin';

import {
  ASUserDataInput,
  ASUserDataOriginInput,
  ASUserDataOutput,
} from './types';

export const backgroundASUserDataChannel = new PopupChannel<
  ASUserDataOriginInput,
  ASUserDataOutput
>(popupsEnum.ASUserData);

export async function getASUserDataResult(
  input: ASUserDataInput,
  sender: Runtime.MessageSender,
): Promise<ASUserDataOutput> {
  const origin = await getAuthorizedOrigin(input, sender);
  return backgroundASUserDataChannel.get({ ...input, origin }, sender);
}
