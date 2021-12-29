import {
  SignerPayloadJSON,
  SignerResult,
} from '@polkadot/types/types/extrinsic';

export type SignPopupInput = SignerPayloadJSON & {
  id: number;
  dAppName: string;
  origin: string;
};

export type SignPopupOutput = SignerResult;
