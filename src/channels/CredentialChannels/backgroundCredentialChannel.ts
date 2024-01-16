import type {
  IEncryptedMessage,
  IReject,
} from '@kiltprotocol/kilt-extension-api/types';

import {
  isSubmitTerms,
  isSubmitAttestation,
  isRejectAttestation,
  isIRequestCredential,
} from '@kiltprotocol/kilt-extension-api/utils';

import { Runtime } from 'webextension-polyfill';

import { BrowserChannel } from '../base/BrowserChannel/BrowserChannel';
import { channelsEnum } from '../base/channelsEnum';
import { claimChannel } from '../claimChannel/claimChannel';
import { saveChannel } from '../saveChannel/saveChannel';
import { rejectChannel } from '../rejectChannel/rejectChannel';
import { shareChannel } from '../shareChannel/shareChannel';
import { getTabEncryption } from '../../utilities/getTabEncryption/getTabEncryption';
import { setCurrentIdentityByDid } from '../../utilities/identities/identities';
import { initKiltSDK } from '../../utilities/initKiltSDK/initKiltSDK';

import { CredentialInput, CredentialOutput } from './types';

export const backgroundCredentialChannel = new BrowserChannel<
  CredentialInput,
  CredentialOutput
>(channelsEnum.credential);

export async function showCredentialPopup(
  input: CredentialInput,
  sender: Runtime.MessageSender,
): Promise<IEncryptedMessage | void> {
  const { message: encrypted, dAppName, specVersion } = input;

  await initKiltSDK();

  const { encrypt, decrypt, dAppEncryptionDidKey } =
    await getTabEncryption(sender);
  const message = await decrypt(encrypted);

  if (isSubmitTerms(message)) {
    try {
      if (specVersion === '1.0') {
        message.body.content.cTypes = message.body.content.cTypes?.map(
          // @ts-expect-error compatibility with old cType interface
          (cType) => cType.schema,
        );
      }

      // the DID to use for signing could be predetermined by the dApp, if we have a matching identity we’ll use it
      await setCurrentIdentityByDid(message.body.content.claim.owner);

      return await claimChannel.get(
        {
          ...message.body.content,
          attesterName: dAppName,
          attesterDid: dAppEncryptionDidKey.controller,
          specVersion,
        },
        sender,
      );
    } catch (error) {
      const rejectionBody: IReject = {
        content: { message: 'Terms rejected' },
        type: 'reject',
      };

      return encrypt(rejectionBody);
    }
  }

  if (isSubmitAttestation(message)) {
    await saveChannel.get(message.body.content.attestation, sender);
  }

  if (isRejectAttestation(message)) {
    await rejectChannel.get(message.body.content, sender);
  }
  if (isIRequestCredential(message)) {
    return await shareChannel.get(
      {
        credentialRequest: message.body.content,
        verifierDid: dAppEncryptionDidKey.controller,
        specVersion,
      },
      sender,
    );
  }
}
