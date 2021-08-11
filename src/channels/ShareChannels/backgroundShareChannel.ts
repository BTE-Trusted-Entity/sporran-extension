import { browser } from 'webextension-polyfill-ts';
import { IRequestForAttestation, IAttestedClaim } from '@kiltprotocol/types';
import { Attestation, AttestedClaim, disconnect } from '@kiltprotocol/core';

import { PopupChannel } from '../base/PopupChannel/PopupChannel';
import { ShareInput } from './types';

type SenderType = Parameters<
  Parameters<typeof browser.runtime.onMessage.addListener>[0]
>[1];

export const backgroundShareChannel = new PopupChannel<
  ShareInput,
  IRequestForAttestation[]
>('share');

export async function getAttestedClaims(
  input: Parameters<typeof backgroundShareChannel.get>[0],
  sender: SenderType,
): Promise<IAttestedClaim[]> {
  const requests = await backgroundShareChannel.get(input, sender);

  const attestedClaims: IAttestedClaim[] = [];
  for (const request of requests) {
    let attestation: Attestation | null;

    try {
      attestation = await Attestation.query(request.rootHash);
    } catch {
      // retry once, since the blockchain connection could have been closed on popup close
      attestation = await Attestation.query(request.rootHash);
    }

    if (!attestation) {
      continue;
    }
    attestedClaims.push(
      AttestedClaim.fromRequestAndAttestation(request, attestation),
    );
  }

  await disconnect();

  return attestedClaims;
}
