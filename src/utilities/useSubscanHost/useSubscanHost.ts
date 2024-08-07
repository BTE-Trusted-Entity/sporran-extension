import { useAsyncValue } from '../useAsyncValue/useAsyncValue';
import { getEndpoint, KnownEndpoints } from '../endpoints/endpoints';

const subscanHosts: Record<KnownEndpoints, string | undefined> = {
  'wss://peregrine.kilt.io': 'https://kilt-testnet.subscan.io',
  'wss://spiritnet.kilt.io': 'https://spiritnet.subscan.io',
  'wss://kilt.dotters.network': 'https://spiritnet.subscan.io',
  'wss://kilt.ibp.network': 'https://spiritnet.subscan.io',
  'wss://peregrine-stg.kilt.io/para': undefined,
};

export function useSubscanHost(): string | undefined {
  const kiltEndpoint = useAsyncValue(getEndpoint, []);
  return kiltEndpoint ? subscanHosts[kiltEndpoint] : undefined;
}
