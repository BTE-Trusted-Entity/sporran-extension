import { Runtime } from 'webextension-polyfill-ts';

import { PopupChannel } from '../base/PopupChannel/PopupChannel';
import { getAuthorizedOrigin } from '../../dApps/AccessChannels/getAuthorizedOrigin';
import { setCurrentIdentityByDid } from '../../utilities/identities/identities';
import { popupsEnum } from '../base/channelsEnum';

import { SignDidInput, SignDidOriginInput, SignDidOutput } from './types';

export const backgroundSignDidChannel = new PopupChannel<
  SignDidOriginInput,
  SignDidOutput
>(popupsEnum.signDid);

export async function getSignDidResult(
  input: SignDidInput,
  sender: Runtime.MessageSender,
): Promise<SignDidOutput> {
  const origin = await getAuthorizedOrigin(input, sender);
  await setCurrentIdentityByDid(input.didUri);
  return backgroundSignDidChannel.get({ ...input, origin }, sender);
}
