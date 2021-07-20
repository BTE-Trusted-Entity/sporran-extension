import { browser } from 'webextension-polyfill-ts';
import { IAttestedClaim, IRequestForAttestation } from '@kiltprotocol/types';
import { Attestation, AttestedClaim } from '@kiltprotocol/core';

import { PopupChannel } from '../base/PopupChannel/PopupChannel';
import { contentShareChannel } from './contentShareChannel';
import { ShareInput } from './types';

type SenderType = Parameters<
  Parameters<typeof browser.runtime.onMessage.addListener>[0]
>[1];

export const backgroundShareChannel = new PopupChannel<
  ShareInput,
  IRequestForAttestation[]
>('share');

async function getAttestedClaims(
  input: Parameters<typeof contentShareChannel.get>[0],
  sender: SenderType,
): Promise<IAttestedClaim[]> {
  const requests = await backgroundShareChannel.get(input, sender);

  const attestedClaims: IAttestedClaim[] = [];
  for (const request of requests) {
    const attestation = await Attestation.query(request.rootHash);
    if (!attestation) {
      continue;
    }
    attestedClaims.push(
      AttestedClaim.fromRequestAndAttestation(request, attestation),
    );
  }

  return attestedClaims;
}

export function initBackgroundShareChannel(): void {
  contentShareChannel.produce(getAttestedClaims);
}
