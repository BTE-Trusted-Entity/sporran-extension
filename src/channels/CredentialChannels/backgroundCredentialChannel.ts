import { Runtime } from 'webextension-polyfill-ts';
import { IEncryptedMessage, IRejectTerms } from '@kiltprotocol/types';

import { BrowserChannel } from '../base/BrowserChannel/BrowserChannel';
import { channelsEnum } from '../base/channelsEnum';
import { claimChannel } from '../claimChannel/claimChannel';
import { saveChannel } from '../saveChannel/saveChannel';
import { shareChannel } from '../shareChannel/shareChannel';
import { getTabEncryption } from '../../utilities/getTabEncryption/getTabEncryption';

import { CredentialInput, CredentialOutput } from './types';

export const backgroundCredentialChannel = new BrowserChannel<
  CredentialInput,
  CredentialOutput
>(channelsEnum.credential);

export async function showCredentialPopup(
  input: CredentialInput,
  sender: Runtime.MessageSender,
): Promise<IEncryptedMessage | void> {
  const { message: encrypted, dAppName } = input;

  const { encrypt, decrypt, dAppEncryptionDidKey } = await getTabEncryption(
    sender,
  );
  const message = await decrypt(encrypted);

  if (message.body.type === 'submit-terms') {
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
        type: 'reject-terms',
      };

      return encrypt(rejectionBody);
    }
  }
  if (message.body.type === 'submit-attestation') {
    await saveChannel.get(message.body.content.attestation, sender);
  }
  if (message.body.type === 'request-credential') {
    return await shareChannel.get(
      {
        credentialRequest: message.body.content,
        verifierDid: dAppEncryptionDidKey.controller,
      },
      sender,
    );
  }
}
