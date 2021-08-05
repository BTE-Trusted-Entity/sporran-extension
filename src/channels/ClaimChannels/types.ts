import { ITerms, IRequestAttestationForClaim } from '@kiltprotocol/types';

export interface ClaimInput extends ITerms {
  attester: string;
}

export type ClaimOutput = IRequestAttestationForClaim;
