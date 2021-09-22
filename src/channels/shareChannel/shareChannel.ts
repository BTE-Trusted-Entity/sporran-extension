import { browser } from 'webextension-polyfill-ts';
import { IRequestForAttestation } from '@kiltprotocol/types';
import { Attestation, AttestedClaim, disconnect } from '@kiltprotocol/core';

import { PopupChannel } from '../base/PopupChannel/PopupChannel';
import { ShareInput } from './types';

interface Output {
  requests: IRequestForAttestation[];
  address: string;
  password: string;
}

type SenderType = Parameters<
  Parameters<typeof browser.runtime.onMessage.addListener>[0]
>[1];

export const shareChannel = new PopupChannel<ShareInput, Output>('share');

export async function getAttestedClaims(
  input: Parameters<typeof shareChannel.get>[0],
  sender: SenderType,
): Promise<{
  attestedClaims: AttestedClaim[];
  address: string;
  password: string;
}> {
  const { requests, address, password } = await shareChannel.get(input, sender);

  const attestedClaims: AttestedClaim[] = [];
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

  return { attestedClaims, address, password };
}
