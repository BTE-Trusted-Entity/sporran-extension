import useSWR from 'swr';

import { getEndpoint } from '../endpoints/endpoints';

const subscanHosts: Record<string, string> = {
  'wss://peregrine.kilt.io/parachain-public-ws':
    'https://kilt-testnet.subscan.io',
  'wss://spiritnet.kilt.io': 'https://spiritnet.subscan.io',
  'wss://kilt-rpc.dwellir.com': 'https://spiritnet.subscan.io',
};

export function useSubscanHost(): string | undefined {
  const kiltEndpoint = useSWR('getEndpoint', getEndpoint).data;
  return kiltEndpoint ? subscanHosts[kiltEndpoint] : undefined;
}
