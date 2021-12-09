import { browser } from 'webextension-polyfill-ts';
import {
  IEncryptedMessage,
  IRejectTerms,
  MessageBodyType,
} from '@kiltprotocol/types';

import { BrowserChannel } from '../base/BrowserChannel/BrowserChannel';
import { CredentialInput, CredentialOutput } from './types';
import { contentCredentialChannel } from './contentCredentialChannel';
import { claimChannel } from '../claimChannel/claimChannel';
import { saveChannel } from '../saveChannel/saveChannel';
import { shareChannel } from '../shareChannel/shareChannel';
import { getTabEncryption } from '../../utilities/getTabEncryption/getTabEncryption';

export const backgroundCredentialChannel = new BrowserChannel<
  CredentialInput,
  CredentialOutput
>('credential');

type SenderType = Parameters<
  Parameters<typeof browser.runtime.onMessage.addListener>[0]
>[1];

async function showCredentialPopup(
  input: CredentialInput,
  sender: SenderType,
): Promise<IEncryptedMessage | void> {
  const { message: encrypted, dAppName } = input;

  const { encrypt, decrypt, dAppEncryptionDidKey } = await getTabEncryption(
    sender,
  );
  const message = await decrypt(encrypted);

  if (message.body.type === MessageBodyType.SUBMIT_TERMS) {
    try {
      return await claimChannel.get(
        {
          ...message.body.content,
          attesterName: dAppName,
          attesterDid: dAppEncryptionDidKey.controller,
        },
        sender,
      );
    } catch (error) {
      const { claim, legitimations, delegationId } = message.body.content;

      const rejectionBody: IRejectTerms = {
        content: { claim, legitimations, delegationId },
        type: MessageBodyType.REJECT_TERMS,
      };

      return encrypt(rejectionBody);
    }
  }
  if (message.body.type === MessageBodyType.SUBMIT_ATTESTATION) {
    await saveChannel.get(message.body.content.attestation, sender);
  }
  if (message.body.type === MessageBodyType.REQUEST_CREDENTIAL) {
    return await shareChannel.get(
      {
        credentialRequest: message.body.content,
        verifierDid: dAppEncryptionDidKey.controller,
      },
      sender,
    );
  }
}

export function initBackgroundCredentialChannel(): void {
  contentCredentialChannel.produce(showCredentialPopup);
}
