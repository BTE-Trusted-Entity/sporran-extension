import { getEndpoint, KnownEndpoints } from '../endpoints/endpoints';

interface ExternalURLs {
  kiltCheckout: string;
  txd: string;
}

const externalURLs: Record<KnownEndpoints, ExternalURLs> = {
  'wss://kilt-rpc.dwellir.com': {
    kiltCheckout: 'https://checkout.kilt.io',
    txd: 'https://txd.trusted-entity.io',
  },
  'wss://spiritnet.kilt.io': {
    kiltCheckout: 'https://checkout.kilt.io',
    txd: 'https://txd.trusted-entity.io',
  },
  'wss://peregrine.kilt.io/parachain-public-ws': {
    kiltCheckout: 'https://dev-checkout.kilt.io',
    txd: 'https://txd-stg.trusted-entity.io',
  },
  'wss://peregrine-stg.kilt.io/para': {
    kiltCheckout: 'https://dev-checkout.kilt.io',
    txd: 'https://txd-stg.trusted-entity.io',
  },
  'wss://sporran-testnet.kilt.io': {
    kiltCheckout: 'https://dev-checkout.kilt.io',
    txd: 'https://txd-stg.trusted-entity.io',
  },
};

export async function getExternalURLs(): Promise<ExternalURLs> {
  const endpoint = await getEndpoint();

  return {
    kiltCheckout: externalURLs[endpoint].kiltCheckout,
    txd: externalURLs[endpoint].txd,
  };
}
