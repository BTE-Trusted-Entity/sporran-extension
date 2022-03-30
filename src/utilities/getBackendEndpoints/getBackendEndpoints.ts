import { getEndpoint } from '../endpoints/endpoints';

const backendOrigins: Record<string, string> = {
  'wss://spiritnet.api.onfinality.io/public-ws':
    'https://did-promo.sporran.org',
  'wss://spiritnet.kilt.io': 'https://did-promo.sporran.org',
  'wss://sporran-testnet.kilt.io': 'https://testnet-did-promo.sporran.org',
};

export async function getBackendEndpoints(): Promise<{
  promoStatus: string;
  createDid: string;
  submitDidCall: string;
  waitFinalized: string;
}> {
  const kiltEndpoint = await getEndpoint();
  const backendOrigin = backendOrigins[kiltEndpoint];

  if (!backendOrigin) {
    throw new Error('No backend origin for KILT endpoint');
  }

  return {
    promoStatus: `${backendOrigin}/promo_status`,
    createDid: `${backendOrigin}/create_did`,
    submitDidCall: `${backendOrigin}/submit_did_call`,
    waitFinalized: `${backendOrigin}/wait_finalized`,
  };
}
