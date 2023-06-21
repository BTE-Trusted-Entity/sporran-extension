import { Runtime } from 'webextension-polyfill-ts';

import { PopupChannel } from '../base/PopupChannel/PopupChannel';
import { getAuthorizedOrigin } from '../../dApps/AccessChannels/getAuthorizedOrigin';
import { setCurrentIdentityByDid } from '../../utilities/identities/identities';
import { popupsEnum } from '../base/channelsEnum';

import {
  SignCrossChainInput,
  SignCrossChainOriginInput,
  SignCrossChainOutput,
} from './types';

export const backgroundSignCrossChainChannel = new PopupChannel<
  SignCrossChainOriginInput,
  SignCrossChainOutput
>(popupsEnum.signCrossChain);

export async function getSignCrossChainResult(
  input: SignCrossChainInput,
  sender: Runtime.MessageSender,
): Promise<SignCrossChainOutput> {
  const origin = await getAuthorizedOrigin(input, sender);
  await setCurrentIdentityByDid(input.didUri);
  return backgroundSignCrossChainChannel.get({ ...input, origin }, sender);
}
