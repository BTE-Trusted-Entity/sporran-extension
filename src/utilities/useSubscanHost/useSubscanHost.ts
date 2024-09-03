import { whichChain } from '../endpoints/whichChain';
import { useAsyncValue } from '../useAsyncValue/useAsyncValue';

export function useSubscanHost(): string | undefined {
  const chainName = useAsyncValue(whichChain, []);

  return chainName === 'KILT Spiritnet'
    ? 'https://spiritnet.subscan.io'
    : undefined;
}
