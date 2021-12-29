import {
  SignerPayloadRaw,
  SignerResult,
} from '@polkadot/types/types/extrinsic';

export type SignRawPopupInput = SignerPayloadRaw & {
  id: number;
  dAppName: string;
  origin: string;
};

export type SignRawPopupOutput = SignerResult;
