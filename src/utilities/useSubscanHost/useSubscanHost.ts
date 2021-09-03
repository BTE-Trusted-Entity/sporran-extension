import { useEffect, useState } from 'react';

import { getEndpoint } from '../endpoints/endpoints';

const subscanHosts: Record<string, string> = {
  'wss://peregrine.kilt.io/': 'https://kilt-testnet.subscan.io',
};

export function useSubscanHost(): string | null {
  const [host, setHost] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const kiltEndpoint = await getEndpoint();
      setHost(subscanHosts[kiltEndpoint] || null);
    })();
  }, []);

  return host;
}
