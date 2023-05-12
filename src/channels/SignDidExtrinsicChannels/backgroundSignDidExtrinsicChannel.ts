import { Runtime } from 'webextension-polyfill-ts';

import { PopupChannel } from '../base/PopupChannel/PopupChannel';
import { getAuthorizedOrigin } from '../../dApps/AccessChannels/getAuthorizedOrigin';
import { setCurrentIdentityByDid } from '../../utilities/identities/identities';
import { popupsEnum } from '../base/channelsEnum';

import {
  SignDidExtrinsicInput,
  SignDidExtrinsicOriginInput,
  SignDidExtrinsicOutput,
} from './types';

export const backgroundSignDidExtrinsicChannel = new PopupChannel<
  SignDidExtrinsicOriginInput,
  SignDidExtrinsicOutput
>(popupsEnum.signDidExtrinsic);

export async function getSignDidExtrinsicResult(
  input: SignDidExtrinsicInput,
  sender: Runtime.MessageSender,
): Promise<SignDidExtrinsicOutput> {
  const origin = await getAuthorizedOrigin(input, sender);
  await setCurrentIdentityByDid(input.didUri);
  return backgroundSignDidExtrinsicChannel.get({ ...input, origin }, sender);
}
