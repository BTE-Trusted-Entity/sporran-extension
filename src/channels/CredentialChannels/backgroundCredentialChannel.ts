import { Runtime } from 'webextension-polyfill-ts';
import { IEncryptedMessage, IRejectTerms } from '@kiltprotocol/sdk-js';

import { BrowserChannel } from '../base/BrowserChannel/BrowserChannel';
import { channelsEnum } from '../base/channelsEnum';
import { claimChannel } from '../claimChannel/claimChannel';
import { saveChannel } from '../saveChannel/saveChannel';
import { shareChannel } from '../shareChannel/shareChannel';
import { getTabEncryption } from '../../utilities/getTabEncryption/getTabEncryption';
import { getIdentities } from '../../utilities/identities/getIdentities';
import {
  getCurrentIdentity,
  setCurrentIdentity,
} from '../../utilities/identities/identities';
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

  const { encrypt, decrypt, dAppEncryptionDidKey } = await getTabEncryption(
    sender,
  );
  const message = await decrypt(encrypted);

  if (message.body.type === 'submit-terms') {
    try {
      const { content } = message.body;
      if (specVersion === '1.0') {
        // @ts-expect-error compatibility with old cType interface
        content.cTypes = content.cTypes?.map((cType) => cType.schema);
      }

      // the DID to use for signing could be predetermined by the dApp, if we have a matching identity we’ll use it
      const identities = await getIdentities();
      const current = await getCurrentIdentity();
      const { owner } = content.claim;
      if (current && identities[current].did !== owner) {
        for (const { address, did } of Object.values(identities)) {
          if (did === owner) {
            await setCurrentIdentity(address);
          }
        }
      }

      return await claimChannel.get(
        {
          ...content,
          attesterName: dAppName,
          attesterDid: dAppEncryptionDidKey.controller,
          specVersion,
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
        specVersion,
      },
      sender,
    );
  }
}
