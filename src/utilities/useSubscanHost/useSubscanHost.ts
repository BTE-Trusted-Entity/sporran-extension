import { getChainName } from '../endpoints/getChainName';
import { useAsyncValue } from '../useAsyncValue/useAsyncValue';

export function useSubscanHost(): string | undefined {
  const chainName = useAsyncValue(getChainName, []);

  return chainName === 'KILT Spiritnet'
    ? 'https://spiritnet.subscan.io'
    : undefined;
}
