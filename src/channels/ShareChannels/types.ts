import {
  IAttestedClaim,
  IRequestClaimsForCTypesContent,
} from '@kiltprotocol/types';

export type ShareInput = IRequestClaimsForCTypesContent[];

export type ShareOutput = IAttestedClaim[];
