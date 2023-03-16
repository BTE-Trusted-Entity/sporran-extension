import { Runtime } from 'webextension-polyfill';

import { popupsEnum } from '../base/channelsEnum';
import { PopupChannel } from '../base/PopupChannel/PopupChannel';
import { getAuthorizedOrigin } from '../AccessChannels/getAuthorizedOrigin';

import {
  ShareIdentitiesInput,
  ShareIdentitiesOriginInput,
  ShareIdentitiesOutput,
} from './types';

export const backgroundShareIdentitiesChannel = new PopupChannel<
  ShareIdentitiesOriginInput,
  ShareIdentitiesOutput
>(popupsEnum.shareIdentities);

export async function getGetDidList(
  input: ShareIdentitiesInput,
  sender: Runtime.MessageSender,
): Promise<ShareIdentitiesOutput> {
  const origin = await getAuthorizedOrigin(input, sender);
  return backgroundShareIdentitiesChannel.get({ ...input, origin }, sender);
}
