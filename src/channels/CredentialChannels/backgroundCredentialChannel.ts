import { browser } from 'webextension-polyfill-ts';
import {
  IEncryptedMessage,
  IRejectTerms,
  IRequestAttestationForClaim,
  IRequestClaimsForCTypes,
  ISubmitAttestationForClaim,
  ISubmitClaimsForCTypes,
  ISubmitTerms,
  MessageBodyType,
} from '@kiltprotocol/types';

import { BrowserChannel } from '../base/BrowserChannel/BrowserChannel';
import { CredentialInput, CredentialOutput } from './types';
import { contentCredentialChannel } from './contentCredentialChannel';
import { claimChannel } from '../claimChannel/claimChannel';
import { saveChannel } from '../saveChannel/saveChannel';
import { getAttestedClaims } from '../shareChannel/shareChannel';
import { getTabEncryption } from '../../utilities/getTabEncryption/getTabEncryption';
import { getIdentityDidEncryption } from '../../utilities/identities/identities';

export const backgroundCredentialChannel = new BrowserChannel<
  CredentialInput,
  CredentialOutput
>('credential');

type SenderType = Parameters<
  Parameters<typeof browser.runtime.onMessage.addListener>[0]
>[1];

async function processSubmitTerms(
  messageBody: ISubmitTerms,
  dAppName: string,
  sender: SenderType,
): Promise<IEncryptedMessage> {
  try {
    const { requestForAttestation, address, password } = await claimChannel.get(
      {
        ...messageBody.content,
        attester: dAppName,
      },
      sender,
    );

    const requestForAttestationBody: IRequestAttestationForClaim = {
      content: { requestForAttestation },
      type: MessageBodyType.REQUEST_ATTESTATION_FOR_CLAIM,
    };

    const { encrypt } = await getIdentityDidEncryption(address, password);

    const { dAppDidDetails } = await getTabEncryption(sender);
    return encrypt(requestForAttestationBody, dAppDidDetails);
  } catch (error) {
    const { claim, legitimations, delegationId } = messageBody.content;

    const rejectionBody: IRejectTerms = {
      content: { claim, legitimations, delegationId },
      type: MessageBodyType.REJECT_TERMS,
    };

    const { encrypt } = await getTabEncryption(sender);
    return encrypt(rejectionBody);
  }
}

async function processSubmitCredential(
  messageBody: ISubmitAttestationForClaim,
  sender: SenderType,
): Promise<void> {
  await saveChannel.get(messageBody.content.attestation, sender);
}

async function processShareCredential(
  messageBody: IRequestClaimsForCTypes,
  sender: SenderType,
): Promise<IEncryptedMessage> {
  const { attestedClaims, address, password } = await getAttestedClaims(
    messageBody.content,
    sender,
  );

  const credentialsBody: ISubmitClaimsForCTypes = {
    content: attestedClaims,
    type: MessageBodyType.SUBMIT_CLAIMS_FOR_CTYPES,
  };

  const { encrypt } = await getIdentityDidEncryption(address, password);

  const { dAppDidDetails } = await getTabEncryption(sender);
  return encrypt(credentialsBody, dAppDidDetails);
}

async function showCredentialPopup(
  input: CredentialInput,
  sender: SenderType,
): Promise<IEncryptedMessage | void> {
  const { message: encrypted, dAppName } = input;

  const { decrypt } = await getTabEncryption(sender);
  const message = await decrypt(encrypted);

  // TODO: uncomment when it works without unsafe-eval
  // errorCheckMessageBody(message.body);

  if (message.body.type === MessageBodyType.SUBMIT_TERMS) {
    return await processSubmitTerms(
      message.body as ISubmitTerms,
      dAppName,
      sender,
    );
  }
  if (message.body.type === MessageBodyType.SUBMIT_ATTESTATION_FOR_CLAIM) {
    await processSubmitCredential(
      message.body as ISubmitAttestationForClaim,
      sender,
    );
  }
  if (message.body.type === MessageBodyType.REQUEST_CLAIMS_FOR_CTYPES) {
    return await processShareCredential(
      message.body as IRequestClaimsForCTypes,
      sender,
    );
  }
}

export function initBackgroundCredentialChannel(): void {
  contentCredentialChannel.produce(showCredentialPopup);
}
