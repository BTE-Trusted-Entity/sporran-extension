import {
  SignerPayloadJSON,
  SignerResult,
} from '@polkadot/types/types/extrinsic';
import { BrowserChannel } from '../../channels/base/BrowserChannel/BrowserChannel';
import { checkAccess } from '../checkAccess/checkAccess';
import { injectedSignChannel } from './injectedSignChannel';

type SignInput = SignerPayloadJSON & { origin: string };

type SignJsonInput = {
  version: string;
  signedExtensions: string;
} & Omit<SignInput, 'version' | 'signedExtensions'>;

type SignOutput = SignerResult;

interface SignJsonOutput {
  id: string;
  signature: string;
}

const transform = {
  inputToJson: (input: SignInput) => ({
    ...input,
    version: String(input.version),
    signedExtensions: JSON.stringify(input.signedExtensions),
  }),
  jsonToInput: (input: SignJsonInput) => ({
    ...input,
    version: parseInt(input.version),
    signedExtensions: JSON.parse(input.signedExtensions),
  }),
  outputToJson: ({ id, signature }: SignOutput) => ({
    id: String(id),
    signature,
  }),
  jsonToOutput: ({ id, signature }: SignJsonOutput) => ({
    id: parseInt(id),
    signature,
  }),
};

export const contentSignChannel = new BrowserChannel<
  SignInput,
  SignOutput,
  SignJsonInput,
  SignJsonOutput
>('dAppSign', false, transform);

export function initContentSignChannel(origin: string): () => void {
  return injectedSignChannel.produce(async ({ dAppName, payload }) => {
    await checkAccess(dAppName, origin);
    return contentSignChannel.get({ ...payload, origin });
  });
}
