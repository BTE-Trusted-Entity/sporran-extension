import { Runtime } from 'webextension-polyfill-ts';

import { popupsEnum } from '../base/channelsEnum';
import { PopupChannel } from '../base/PopupChannel/PopupChannel';
import { getAuthorizedOrigin } from '../../dApps/AccessChannels/getAuthorizedOrigin';

import { CreateDidInput, CreateDidOriginInput, CreateDidOutput } from './types';

export const backgroundCreateDidChannel = new PopupChannel<
  CreateDidOriginInput,
  CreateDidOutput
>(popupsEnum.createDid);

export async function getCreateDidResult(
  input: CreateDidInput,
  sender: Runtime.MessageSender,
): Promise<CreateDidOutput> {
  const origin = await getAuthorizedOrigin(input, sender);
  return backgroundCreateDidChannel.get({ ...input, origin }, sender);
}
